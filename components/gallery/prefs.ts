"use client";
import { useEffect, useState } from "react";

export type Mode = "images" | "videos";
export type SortKey = "newest" | "trend";

const PREF = "gaia_gallery_prefs";
const VIEWS = "gaia_gallery_views";
const ADDED = "gaia_gallery_addedAt";
const VIDEO_PROGRESS = "gaia_gallery_video_progress";
const VIDEO_VOLUME = "gaia_gallery_video_volume";
const FAVORITES = "gaia_gallery_favorites";

export function usePrefs() {
  const [mode, setMode] = useState<Mode>("images");
  const [sort, setSort] = useState<SortKey>("trend");
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREF);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.mode) setMode(p.mode);
        if (p.sort) setSort(p.sort);
        if (p.query) setQuery(p.query);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(PREF, JSON.stringify({ mode, sort, query }));
  }, [mode, sort, query]);

  return { mode, setMode, sort, setSort, query, setQuery };
}

export function getViews(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(VIEWS) || "{}");
  } catch {
    return {};
  }
}
export function incView(id: string) {
  const map = getViews();
  map[id] = (map[id] || 0) + 1;
  localStorage.setItem(VIEWS, JSON.stringify(map));
}

export function resetViews() {
  localStorage.setItem(VIEWS, "{}");
  window.dispatchEvent(new CustomEvent("gallery:view-updated"));
}
export function getAddedMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(ADDED) || "{}");
  } catch {
    return {};
  }
}
export function setAddedDate(id: string, iso: string) {
  const map = getAddedMap();
  if (!map[id]) {
    map[id] = iso;
    localStorage.setItem(ADDED, JSON.stringify(map));
  }
}

export function getFavorites(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES) || "{}");
  } catch {
    return {};
  }
}

export function setFavorite(id: string, value: boolean) {
  const map = getFavorites();
  if (value) {
    map[id] = true;
  } else {
    delete map[id];
  }
  localStorage.setItem(FAVORITES, JSON.stringify(map));
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("gallery:favorites-updated", {
        detail: { id, value },
      })
    );
  }
}


export function getVideoProgressMap(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(VIDEO_PROGRESS) || "{}");
  } catch {
    return {};
  }
}

export function setVideoProgress(id: string, seconds: number) {
  const map = getVideoProgressMap();
  const previous = map[id];
  map[id] = seconds;
  localStorage.setItem(VIDEO_PROGRESS, JSON.stringify(map));
  if (
    typeof window !== "undefined" &&
    (previous === undefined || Math.abs(previous - seconds) >= 0.5)
  ) {
    window.dispatchEvent(
      new CustomEvent("gallery:video-progress", {
        detail: { id, seconds },
      })
    );
  }
}

export function getVideoProgress(id: string): number {
  const map = getVideoProgressMap();
  return map[id] ?? 0;
}

export function getVideoVolume(): number | undefined {
  const raw = localStorage.getItem(VIDEO_VOLUME);
  if (!raw) return undefined;
  const vol = Number(raw);
  return Number.isFinite(vol) ? Math.min(Math.max(vol, 0), 1) : undefined;
}

export function setVideoVolume(volume: number) {
  const safe = Math.min(Math.max(volume, 0), 1);
  localStorage.setItem(VIDEO_VOLUME, String(safe));
}
