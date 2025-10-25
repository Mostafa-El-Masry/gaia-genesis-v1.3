"use client";
import { useEffect, useMemo, useState } from "react";
import type { GalleryItem } from "./types";
import { EyeGlyph, PhotoGlyph, VideoGlyph } from "./icons";
import { getViews } from "./prefs";
import { formatDuration, formatViews } from "./metrics";
import { getDisplayName } from "./utils";

function pickRandom<T extends GalleryItem>(
  arr: T[],
  type: "image" | "video"
): T | null {
  const list = arr.filter((x) => x.type === type);
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

function FeaturedTile({
  item,
  type,
  views,
  onClick,
}: {
  item: GalleryItem | null;
  type: "image" | "video";
  views: number;
  onClick: (id: string) => void;
}) {
  if (!item) return null;

  const isVideo = type === "video";
  const src = isVideo
    ? item.preview?.[0] ?? "/media/video-placeholder.jpg"
    : item.src;
  const duration = formatDuration(item.duration);

  return (
    <button
      type="button"
      className={`featured-card featured-card--${type}`}
      onClick={() => onClick(item.id)}
      aria-label={getDisplayName(item.src, item.id)}
    >
      <img src={src} alt="" className="featured-card__media" loading="lazy" />
      <div className="featured-card__overlay">
        <div className="featured-card__meta featured-card__meta--overlay">
          <span className="featured-card__meta-item">
            <span className="featured-card__badge-icon">
              {isVideo ? (
                <VideoGlyph className="gallery-icon" />
              ) : (
                <PhotoGlyph className="gallery-icon" />
              )}
            </span>
            {formatViews(views)}
          </span>
          {isVideo && duration && (
            <span className="featured-card__meta-item">{duration}</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function Featured({
  items,
  onOpen,
}: {
  items: GalleryItem[];
  onOpen: (idx: number) => void;
}) {
  const [viewMap, setViewMap] = useState<Record<string, number>>({});
  const [img, vid] = useMemo(
    () => [pickRandom(items, "image"), pickRandom(items, "video")],
    [items]
  );

  useEffect(() => {
    function syncViews() {
      try {
        setViewMap(getViews());
      } catch {
        setViewMap({});
      }
    }
    syncViews();
    const handle = () => syncViews();
    window.addEventListener("storage", handle);
    window.addEventListener("gallery:view-updated", handle);
    return () => {
      window.removeEventListener("storage", handle);
      window.removeEventListener("gallery:view-updated", handle);
    };
  }, [items.length]);

  const handleClick = (id: string) => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx >= 0) onOpen(idx);
  };

  return (
    <div className="featured-grid">
      <FeaturedTile
        key="featured-image"
        item={img}
        type="image"
        views={img ? viewMap[img.id] ?? 0 : 0}
        onClick={handleClick}
      />
      <FeaturedTile
        key="featured-video"
        item={vid}
        type="video"
        views={vid ? viewMap[vid.id] ?? 0 : 0}
        onClick={handleClick}
      />
    </div>
  );
}
