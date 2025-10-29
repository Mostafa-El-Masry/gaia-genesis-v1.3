'use client';

import ExportPanel from '../sync/components/ExportPanel';
import ImportPanel from '../sync/components/ImportPanel';

export default function BackupPanel(){
  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="mb-2">
          <h2 className="text-lg font-extrabold tracking-wide">Backup</h2>
          <p className="text-sm opacity-70">Export your GAIA data (LocalStorage) as plain or password-protected JSON.</p>
        </div>
        <ExportPanel />
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
        <div className="mb-2">
          <h2 className="text-lg font-extrabold tracking-wide">Restore</h2>
          <p className="text-sm opacity-70">Preview and import backups (Merge or Replace). Encrypted backups need the correct password.</p>
        </div>
        <ImportPanel />
      </div>
    </section>
  );
}
