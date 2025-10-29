"use client";

import "./gallery.css";
import { useEffect, useMemo, useRef, useState } from "react";
import Featured from "@/components/gallery/Featured";
import Grid from "@/components/gallery/Grid";
import Lightbox from "@/components/gallery/Lightbox";
import {
  usePrefs,
  getAddedMap,
  setAddedDate,
} from "@/components/gallery/prefs";
import type { GalleryItem } from "@/components/gallery/types";
import type { Mode } from "@/components/gallery/prefs";
import { SearchGlyph, ClockGlyph } from "@/components/gallery/icons";

type ScanResp = { items: GalleryItem[] };

async function fetchManifest(): Promise<GalleryItem[]> {
  try {
    const res = await fetch("/gallery-manifest.json", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.items)) return json.items;
    }
  } catch {}

  const res = await fetch("/api/gallery/scan", { cache: "no-store" });
  const js = (await res.json()) as ScanResp;
  return js.items ?? [];
}

export default function GalleryClient() {
  const { mode, setMode, sort, setSort, query, setQuery } = usePrefs();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [viewsVersion, setViewsVersion] = useState(0);
  const [pendingFeaturedId, setPendingFeaturedId] = useState<string | null>(
    null
  );
  const searchRef = useRef<HTMLInputElement>(null);
  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await fetchManifest();
      const addedMap = getAddedMap();
      const now = new Date().toISOString();
      const merged = list.map((it) => {
        const addedAt = addedMap[it.id] || it.addedAt || now;
        if (!addedMap[it.id]) setAddedDate(it.id, addedAt);
        return { ...it, addedAt };
      });
      setItems(merged);
    })();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key.toLowerCase() === "g" && e.ctrlKey) {
        e.preventDefault();
        window.location.href = "/";
      } else if (e.key.toLowerCase() === "s") {
        setSort(sort === "newest" ? "trend" : "newest");
      } else if (e.key.toLowerCase() === "i") {
        setMode("images");
      } else if (e.key.toLowerCase() === "v") {
        setMode("videos");
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMode, setSort, sort]);

  useEffect(() => {
    if (!sortMenuOpen) return;

    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        sortMenuRef.current?.contains(target) ||
        sortBtnRef.current?.contains(target)
      )
        return;
      setSortMenuOpen(false);
    }

    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setSortMenuOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [sortMenuOpen]);

  useEffect(() => {
    const handle = () => setViewsVersion((v) => v + 1);
    window.addEventListener("gallery:view-updated", handle);
    window.addEventListener("storage", handle);
    return () => {
      window.removeEventListener("gallery:view-updated", handle);
      window.removeEventListener("storage", handle);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? items
      : items.filter((i) =>
          mode === "images" ? i.type === "image" : i.type === "video"
        );

    const searched = q
      ? base.filter((i) => i.src.toLowerCase().includes(q))
      : base;

    if (sort === "newest") {
      return [...searched].sort((a, b) =>
        (b.addedAt || "").localeCompare(a.addedAt || "")
      );
    }

    const views =
      typeof window === "undefined"
        ? {}
        : JSON.parse(localStorage.getItem("gaia_gallery_views") || "{}");
    return [...searched].sort(
      (a, b) => (views[b.id] || 0) - (views[a.id] || 0)
    );
  }, [items, mode, query, sort, viewsVersion]);

  const activeIndex = useMemo(() => {
    if (!openId) return -1;
    return filtered.findIndex((i) => i.id === openId);
  }, [filtered, openId]);

  function openAt(idx: number) {
    const target = filtered[idx];
    if (target) setOpenId(target.id);
  }
  function close() {
    setOpenId(null);
  }
  function prev() {
    if (activeIndex === -1 || filtered.length === 0) return;
    const nextIndex = (activeIndex - 1 + filtered.length) % filtered.length;
    const target = filtered[nextIndex];
    if (target) setOpenId(target.id);
  }
  function next() {
    if (activeIndex === -1 || filtered.length === 0) return;
    const nextIndex = (activeIndex + 1) % filtered.length;
    const target = filtered[nextIndex];
    if (target) setOpenId(target.id);
  }

  function openFeatured(idx: number) {
    const selected = items[idx];
    if (!selected) return;
    const targetMode: Mode = selected.type === "image" ? "images" : "videos";
    if (mode !== targetMode) {
      setMode(targetMode);
      setPendingFeaturedId(selected.id);
      return;
    }
    const exists = filtered.some((i) => i.id === selected.id);
    if (exists) {
      setOpenId(selected.id);
    } else {
      setPendingFeaturedId(selected.id);
    }
  }

  useEffect(() => {
    if (!pendingFeaturedId) return;
    const exists = filtered.some((i) => i.id === pendingFeaturedId);
    if (!exists) return;
    setOpenId(pendingFeaturedId);
    setPendingFeaturedId(null);
  }, [filtered, pendingFeaturedId]);

  async function scanNow() {
    const res = await fetch("/api/gallery/scan");
    const js = (await res.json()) as ScanResp;
    const addedMap = getAddedMap();
    const now = new Date().toISOString();
    const merged = js.items.map((it) => {
      const addedAt = addedMap[it.id] || it.addedAt || now;
      if (!addedMap[it.id]) setAddedDate(it.id, addedAt);
      return { ...it, addedAt };
    });
    setItems(merged);
  }

  return (
    <main className="gallery-page">
      <div className="gallery-shell">
        <section className="gallery-hero">
          <div className="gallery-hero__copy">
            <div className="gallery-search">
              <button type="button" className="gallery-search__type">
                <span className="gallery-search__type-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M17.5 15.8333H2.5C2.04167 15.8333 1.66667 15.4583 1.66667 15V5C1.66667 4.54167 2.04167 4.16667 2.5 4.16667H17.5C17.9583 4.16667 18.3333 4.54167 18.3333 5V15C18.3333 15.4583 17.9583 15.8333 17.5 15.8333ZM3.33333 14.1667H16.6667V5.83333H3.33333V14.1667ZM6.66667 12.5H4.16667V10.8333H6.66667V12.5ZM10 12.5H7.5V10.8333H10V12.5ZM13.3333 12.5H10.8333V10.8333H13.3333V12.5ZM15.8333 9.16667H4.16667V7.5H15.8333V9.16667Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Photos
                <span className="gallery-search__type-caret">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              <input
                ref={searchRef}
                type="search"
                placeholder="Search for free photos"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onInput={(e) => setQuery(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
                }}
                className="gallery-search__input"
              />

              <button
                type="button"
                className="gallery-search__submit"
                onClick={() => searchRef.current?.focus()}
                aria-label="Search gallery"
              >
                <SearchGlyph className="gallery-icon" />
              </button>

              <div className="gallery-search__panel">
                <div className="gallery-search__section">
                  <h3 className="gallery-search__section-title">
                    Recent searches
                  </h3>
                  <div className="gallery-search__recents">
                    <button
                      type="button"
                      className="gallery-search__recent-item"
                    >
                      <span className="gallery-search__recent-icon">
                        <ClockGlyph />
                      </span>
                      Hi
                    </button>
                  </div>
                </div>

                <div className="gallery-search__section">
                  <h3 className="gallery-search__section-title">Collections</h3>
                  <div className="gallery-search__collections">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="gallery-search__collection">
                        <div className="gallery-search__collection-images"></div>
                        <h4 className="gallery-search__collection-title">
                          Nature
                        </h4>
                        <p className="gallery-search__collection-subtitle">
                          1.2K photos
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gallery-featured">
            <Featured items={items} onOpen={openFeatured} />
          </div>
        </section>
        <section className="gallery-controls">
          <div className="gallery-controls__actions">
            <button className="gallery-action" onClick={scanNow}>
              Sync library
            </button>
            <button
              className="gallery-action"
              onClick={() => {
                window.localStorage.setItem("gaia_gallery_views", "{}");
                window.dispatchEvent(new CustomEvent("gallery:view-updated"));
              }}
            >
              Reset views
            </button>
          </div>
          <div className="toggle">
            <button
              className={mode === "images" ? "active" : ""}
              onClick={() => setMode("images")}
            >
              Images
            </button>
            <button
              className={mode === "videos" ? "active" : ""}
              onClick={() => setMode("videos")}
            >
              Videos
            </button>
          </div>
          <div className="gallery-controls__sort">
            <button
              type="button"
              className={`sort-button${sortMenuOpen ? " is-open" : ""}`}
              ref={sortBtnRef}
              onClick={() => setSortMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={sortMenuOpen}
            >
              <span className="sort-button__label">
                {sort === "trend" ? "Trending" : "Newest"}
              </span>
              <span className="sort-button__icon" aria-hidden>
                â–¼
              </span>
            </button>
            {sortMenuOpen && (
              <div className="sort-dropdown" ref={sortMenuRef} role="menu">
                {[
                  { key: "trend", label: "Trending" },
                  { key: "newest", label: "Newest" },
                ].map((opt) => {
                  const active = sort === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      role="menuitemradio"
                      aria-checked={active}
                      className={`sort-option${active ? " is-active" : ""}`}
                      onClick={() => {
                        setSort(opt.key as any);
                        setSortMenuOpen(false);
                      }}
                    >
                      <span>{opt.label}</span>
                      {active && <span className="sort-option__check">âœ“</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="gallery-grid">
          <Grid items={filtered} onOpen={openAt} />
        </section>
      </div>

      <Lightbox
        item={activeIndex === -1 ? null : filtered[activeIndex]}
        queue={filtered}
        currentIndex={activeIndex}
        onClose={close}
        onPrev={prev}
        onNext={next}
        onSelect={openAt}
      />
    </main>
  );
}



