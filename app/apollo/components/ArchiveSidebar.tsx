"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ApolloData } from "../lib/types";

const inputStyles =
  "w-full rounded-2xl border border-slate-200 bg-white/85 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";
const buttonStyles =
  "inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100";

const STORAGE_KEY = "gaia_apollo_v1_notes";

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 6.75C3 5.784 3.784 5 4.75 5h5.25A2.25 2.25 0 0 1 12.25 7.25V19a1 1 0 0 1-1.447.894l-1.553-.776a2 2 0 0 0-.894-.211H4.75A1.75 1.75 0 0 1 3 17.157V6.75z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 6.75C21 5.784 20.216 5 19.25 5H14a2.25 2.25 0 0 0-2.25 2.25V19a1 1 0 0 0 1.447.894l1.553-.776a2 2 0 0 1 .894-.211h3.606A1.75 1.75 0 0 0 21 17.157V6.75z"
      />
    </svg>
  );
}

export default function ArchiveSidebar({
  data,
  topicId,
  setTopicId,
  sectionId,
  setSectionId,
}: {
  data: ApolloData;
  topicId?: string;
  setTopicId: (id?: string) => void;
  sectionId?: string;
  setSectionId: (id?: string) => void;
}) {
  const [newTopic, setNewTopic] = useState("");
  const [filter, setFilter] = useState("");

  const topics = data.topics ?? [];
  const current = useMemo(
    () => topics.find((t) => t.id === topicId) ?? topics[0],
    [topics, topicId]
  );

  useEffect(() => {
    if (!topicId && topics.length > 0) {
      setTopicId(topics[0].id);
    }
  }, [topicId, topics, setTopicId]);

  function handleAddTopic() {
    const title = newTopic.trim();
    if (!title) return;

    const json = localStorage.getItem(STORAGE_KEY) || '{"topics":[]}';
    const payload = JSON.parse(json) as ApolloData;
    const existing = payload.topics.find(
      (t) => t.title.toLowerCase() === title.toLowerCase()
    );

    if (existing) {
      setTopicId(existing.id);
      setNewTopic("");
      return;
    }

    const id = Math.random().toString(36).slice(2, 10);
    payload.topics.push({ id, title, sections: [] });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setTopicId(id);
    setNewTopic("");
  }

  const visibleSections =
    current?.sections.filter((section) =>
      section.heading.toLowerCase().includes(filter.toLowerCase())
    ) ?? [];

  return (
    <aside className="flex h-full flex-col gap-5 rounded-3xl border border-slate-200 bg-gradient-to-b from-white/90 to-white/60 p-6 shadow-lg ring-1 ring-black/5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Archives
          </p>
          <p className="text-lg font-semibold text-slate-900">
            {current ? current.title : "No topics yet"}
          </p>
        </div>
        {sectionId ? (
          <Link
            href={`/apollo/section/${sectionId}`}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20"
            title="Open active section (full view)"
          >
            <BookIcon />
          </Link>
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
            <BookIcon />
          </div>
        )}
      </header>

      <div className="space-y-3">
        <select
          className={inputStyles}
          value={current?.id ?? ""}
          onChange={(e) => setTopicId(e.target.value)}
        >
          {topics.length === 0 && <option value="">No topics yet</option>}
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <div className="flex gap-3">
          <input
            className={inputStyles}
            placeholder="New topic title..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
          />
          <button className={buttonStyles} onClick={handleAddTopic}>
            Add
          </button>
        </div>
        <input
          className={inputStyles}
          placeholder="Filter sections..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
          Sections
        </p>
        <div className="max-h-[55vh] space-y-2 overflow-y-auto pr-1">
          {visibleSections.map((section) => {
            const isActive = section.id === sectionId;
            return (
              <button
                key={section.id}
                className={`w-full rounded-2xl border px-4 py-3 text-left shadow-sm transition ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-slate-900/30"
                    : "border-slate-200 bg-white/70 text-slate-900 hover:border-slate-300"
                }`}
                onClick={() => setSectionId(section.id)}
              >
                <div className="font-semibold">{section.heading}</div>
                <div className="text-xs text-slate-400">
                  {new Date(section.editedAt).toLocaleString()}
                </div>
              </button>
            );
          })}

          {visibleSections.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
              {current
                ? "No sections match your filter."
                : "Create a topic to start archiving."}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
