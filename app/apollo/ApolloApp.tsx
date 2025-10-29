"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AskPanel from "./components/AskPanel";
import ArchiveSidebar from "./components/ArchiveSidebar";
import SearchBox from "./components/SearchBox";
import SectionEditor from "./components/SectionEditor";
import SectionViewer from "./components/SectionViewer";
import Toolbar from "./components/Toolbar";
import type { ApolloData, ApolloPrefs, Section } from "./lib/types";
import {
  getSectionById,
  getTopicById,
  loadData,
  loadPrefs,
  replaceSection,
  saveData,
  savePrefs,
  search,
} from "./lib/store";

const panelClasses =
  "rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm ring-1 ring-black/5";
const subtleButton =
  "inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100";

export default function ApolloPage() {
  const [data, setData] = useState<ApolloData>({ topics: [] });
  const [prefs, setPrefs] = useState<ApolloPrefs>({});
  const [editing, setEditing] = useState(false);
  const [query, setQuery] = useState("");

  const topic = useMemo(
    () => getTopicById(data, prefs.topicId),
    [data, prefs.topicId]
  );

  const section = useMemo(
    () => getSectionById(topic, prefs.sectionId),
    [topic, prefs.sectionId]
  );

  useEffect(() => {
    const storedData = loadData();
    const storedPrefs = loadPrefs();
    setData(storedData);
    setPrefs(storedPrefs);
    if (storedPrefs.query) {
      setQuery(storedPrefs.query);
    }
  }, []);

  const commitPrefs = useCallback((partial: Partial<ApolloPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...partial };
      savePrefs(next);
      return next;
    });
  }, []);

  const handleSave = useCallback(
    (sec: Section, text: string) => {
      replaceSection(sec, text);
      saveData(data);
      setData({ ...data });
      setEditing(false);
    },
    [data]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (editing && section) {
          handleSave(section, section.blocks.join("\n\n"));
        }
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setEditing(true);
      } else if (e.key === "Escape") {
        setEditing(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, handleSave, section]);

  const results = useMemo(() => {
    return query ? search(data, query) : [];
  }, [data, query]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row-reverse">
        <div className="w-full shrink-0 lg:w-80">
          <ArchiveSidebar
            data={data}
            topicId={prefs.topicId}
            setTopicId={(id) => commitPrefs({ topicId: id })}
            sectionId={prefs.sectionId}
            setSectionId={(id) => commitPrefs({ sectionId: id })}
          />
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                Apollo archives
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                {topic ? `${topic.title}` : "Choose a topic"}
              </h1>
            </div>
            <div className="w-full sm:max-w-sm">
              <SearchBox
                value={query}
                onChange={(value) => {
                  setQuery(value);
                  commitPrefs({ query: value });
                }}
              />
            </div>
          </div>

          <Toolbar onNewSection={() => setEditing(true)} />

          <div className="grid gap-6 xl:grid-cols-2">
            <div className={panelClasses}>
              <AskPanel
                onChange={(updated) => {
                  setData(updated);
                }}
              />
            </div>

            <div className={`${panelClasses} flex flex-col gap-4`}>
              {section ? (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Active section
                      </p>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {section.heading}
                      </h2>
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(section.editedAt).toLocaleString()}
                    </div>
                    <div className="ml-auto">
                      <button
                        className={subtleButton}
                        onClick={() => setEditing((prev) => !prev)}
                      >
                        {editing ? "Close editor" : "Edit"}
                      </button>
                    </div>
                  </div>

                  {editing ? (
                    <SectionEditor
                      section={section}
                      onSave={(text) => handleSave(section, text)}
                    />
                  ) : (
                    <SectionViewer section={section} />
                  )}
                </>
              ) : (
                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-center text-sm text-slate-500">
                  Select a section from the archives or paste a response from
                  the Ask panel.
                </div>
              )}
            </div>
          </div>

          {results.length > 0 && (
            <div className={panelClasses}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Search results</h3>
                <span className="text-sm text-slate-400">
                  {results.length} hits
                </span>
              </div>
              <div className="space-y-2">
                {results.map((result) => (
                  <button
                    key={result.sectionId}
                    className="w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-left shadow-sm transition hover:border-slate-300 hover:bg-white"
                    onClick={() => {
                      const matchingTopic = data.topics.find((item) =>
                        item.sections.some(
                          (entry) => entry.id === result.sectionId
                        )
                      );

                      commitPrefs({
                        topicId: matchingTopic?.id,
                        sectionId: result.sectionId,
                      });
                      setQuery("");
                    }}
                  >
                    <div className="font-semibold">
                      {result.topic} - {result.heading}
                    </div>
                    <div className="text-sm text-slate-500">
                      {result.snippet}...
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
