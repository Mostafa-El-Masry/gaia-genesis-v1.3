"use client";

import React from "react";
import Link from "next/link";
import { loadData, getTopicById, getSectionById } from "../lib/store";
import SectionViewer from "./SectionViewer";

export default function SectionFullView({ sectionId }: { sectionId: string }) {
  const data = loadData();
  // find the section across topics
  let foundSection = undefined;
  let topicTitle = undefined;
  for (const t of data.topics) {
    const s = t.sections.find((s) => s.id === sectionId);
    if (s) {
      foundSection = s;
      topicTitle = t.title;
      break;
    }
  }

  if (!foundSection) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Section not found</h1>
            <Link href="/apollo" className="text-sm text-slate-600">
              Back
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-slate-600">
            The requested section could not be found in your archives.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase text-slate-400">
              {topicTitle}
            </div>
            <h1 className="text-2xl font-bold">{foundSection.heading}</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/apollo"
              className="inline-flex items-center rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700"
            >
              Back to archives
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/90 p-6">
          <SectionViewer section={foundSection} />
        </div>
      </div>
    </div>
  );
}
