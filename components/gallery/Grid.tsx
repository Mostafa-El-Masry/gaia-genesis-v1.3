"use client";
import type { MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GalleryItem } from "./types";
import { getFavorites, getViews, setFavorite } from "./prefs";
import { formatDuration, formatViews } from "./metrics";
import {
  DownloadGlyph,
  EyeGlyph,
  HeartFilledGlyph,
  HeartGlyph,
  PlayBadgeGlyph,
} from "./icons";
import { getDisplayName } from "./utils";

const PAGE_SIZE = 20;

export default function Grid({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (idx: number) => void;
}) {
  const [viewMap, setViewMap] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [limit, setLimit] = useState(PAGE_SIZE);
  const signatureRef = useRef<string>("");
  const signature = useMemo(
    () =>
      items
        .slice(0, PAGE_SIZE)
        .map((item) => item.id)
        .join("|"),
    [items]
  );

  useEffect(() => {
    setLimit((prev) => {
      const base = Math.min(PAGE_SIZE, items.length || PAGE_SIZE);
      if (signatureRef.current !== signature) {
        signatureRef.current = signature;
        return base;
      }
      signatureRef.current = signature;
      return Math.min(items.length, Math.max(prev, PAGE_SIZE));
    });
  }, [items.length, signature]);

  const slice = useMemo(() => items.slice(0, limit), [items, limit]);
  const hasMore = limit < items.length;

  const handleLoadMore = () => {
    setLimit((prev) => Math.min(items.length, prev + PAGE_SIZE));
  };

  useEffect(() => {
    function syncViews() {
      try {
        setViewMap(getViews());
      } catch {
        setViewMap({});
      }
    }
    syncViews();
    window.addEventListener("storage", syncViews);
    const handleCustom = () => syncViews();
    window.addEventListener("gallery:view-updated", handleCustom);
    return () => {
      window.removeEventListener("storage", syncViews);
      window.removeEventListener("gallery:view-updated", handleCustom);
    };
  }, [items.length]);

  useEffect(() => {
    const syncFavorites = () => {
      try {
        setFavorites(getFavorites());
      } catch {
        setFavorites({});
      }
    };
    syncFavorites();
    function onFavoriteEvent(event: Event) {
      const detail = (event as CustomEvent<{ id: string; value: boolean }>)
        .detail;
      if (!detail) {
        syncFavorites();
        return;
      }
      setFavorites((prev) => {
        const next = { ...prev };
        if (detail.value) {
          next[detail.id] = true;
        } else {
          delete next[detail.id];
        }
        return next;
      });
    }
    window.addEventListener("gallery:favorites-updated", onFavoriteEvent);
    window.addEventListener("storage", syncFavorites);
    return () => {
      window.removeEventListener("gallery:favorites-updated", onFavoriteEvent);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const nextValue = !prev[id];
      const next = { ...prev };
      if (nextValue) {
        next[id] = true;
      } else {
        delete next[id];
      }
      try {
        setFavorite(id, nextValue);
      } catch {
        // ignore write errors; state already updated optimistically
      }
      return next;
    });
  };

  return (
    <div className="gallery-grid__inner">
      <div className="gallery-grid-list">
        {slice.map((item, idx) => (
          <GalleryCard
            key={item.id}
            item={item}
            idx={idx}
            onOpen={onOpen}
            views={viewMap[item.id] ?? 0}
            isFavorite={Boolean(favorites[item.id])}
            onToggleFavorite={() => handleToggleFavorite(item.id)}
          />
        ))}
      </div>
      {hasMore && (
        <div className="load-more">
          <button
            type="button"
            className="load-more__btn"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

function GalleryCard({
  item,
  idx,
  onOpen,
  views,
  isFavorite,
  onToggleFavorite,
}: {
  item: GalleryItem;
  idx: number;
  onOpen: (idx: number) => void;
  views: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const cover =
    item.type === "image"
      ? item.src
      : item.preview?.[0] ?? "/media/video-placeholder.jpg";
  const fallbackRatio = item.type === "video" ? 16 / 9 : undefined;
  const aspect = useAspect(cover, fallbackRatio);
  const [rowSpan, setRowSpan] = useState<number | undefined>(undefined);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const grid = node.parentElement;
    if (!grid) return;

    const compute = () => {
      if (!grid) return;
      const styles = window.getComputedStyle(grid);
      const rowHeight =
        parseFloat(styles.getPropertyValue("grid-auto-rows")) || 1;
      const gap = parseFloat(styles.getPropertyValue("row-gap")) || 0;
      const height = node.getBoundingClientRect().height;
      const span = Math.max(1, Math.ceil((height + gap) / (rowHeight + gap)));
      setRowSpan((prev) => (prev === span ? prev : span));
    };

    compute();
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => compute());
      observer.observe(node);
    }
    window.addEventListener("resize", compute);
    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [item.id]);

  const style: React.CSSProperties = {};
  if (typeof aspect === "number") {
    (style as any)["--card-aspect"] = aspect;
  }
  if (rowSpan) {
    style.gridRowEnd = `span ${rowSpan}`;
  }

  const name = getDisplayName(item.src, item.id);
  const viewLabel = formatViews(views);
  const durationLabel =
    item.type === "video" ? formatDuration(item.duration) : undefined;

  const downloadName = item.src.split("/").pop() ?? `${name}`;

  const handleFavoriteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <figure
      ref={cardRef}
      className={`card card--${item.type} relative cursor-pointer`}
      style={style}
      onClick={() => onOpen(idx)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="card-media-wrapper">
        {item.type === "image" ? (
          <img src={item.src} alt="" className="card-media" loading="lazy" />
        ) : (
          <VideoThumb it={item} cover={cover} />
        )}
        <div className="card-overlay">
          <div className="card-overlay__row card-overlay__row--top">
            <div className="card-overlay__badges">
              <span className="card-pill card-pill--views">
                <EyeGlyph className="card-pill__icon" strokeWidth={1.8} />
                {viewLabel}
              </span>
              {durationLabel && (
                <span className="card-pill card-pill--muted">
                  {durationLabel}
                </span>
              )}
            </div>
            <button
              type="button"
              className={`card-overlay__favorite${
                isFavorite ? " is-active" : ""
              }`}
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              {isFavorite ? (
                <HeartFilledGlyph className="card-overlay__favorite-icon" />
              ) : (
                <HeartGlyph
                  className="card-overlay__favorite-icon"
                  strokeWidth={1.8}
                />
              )}
            </button>
          </div>
          <div className="card-overlay__row card-overlay__row--bottom">
            <span className="card-overlay__title" title={name}>
              {name}
            </span>
            <a
              className="card-overlay__download"
              href={item.src}
              download={downloadName}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Download ${name}`}
            >
              <DownloadGlyph
                className="card-overlay__download-icon"
                strokeWidth={1.8}
              />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>
    </figure>
  );
}

function VideoThumb({ it, cover }: { it: GalleryItem; cover: string }) {
  const [frame, setFrame] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const previews = it.preview || [];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onEnter() {
      if (!previews.length) return;
      let i = 0;
      timer.current = setInterval(() => {
        i = (i + 1) % previews.length;
        setFrame(i);
      }, 1200);
    }
    function onLeave() {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
      setFrame(0);
    }
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      if (!el) return;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      if (timer.current) clearInterval(timer.current);
    };
  }, [previews.length]);

  const source = previews[frame] ?? cover;

  return (
    <div ref={ref} className="video-thumb relative">
      <img src={source} alt="" className="card-media" loading="lazy" />
      <span className="video-badge" aria-hidden>
        <PlayBadgeGlyph className="video-badge__icon" />
      </span>
    </div>
  );
}

function useAspect(src?: string, fallback?: number) {
  const [ratio, setRatio] = useState<number | undefined>(fallback);

  useEffect(() => {
    if (!src) {
      setRatio(fallback);
      return;
    }
    let active = true;
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (!active) return;
      const computed =
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : fallback;
      setRatio(computed || fallback);
    };
    img.onerror = () => {
      if (active) setRatio(fallback);
    };
    img.src = src;
    return () => {
      active = false;
    };
  }, [src, fallback]);

  return ratio;
}
