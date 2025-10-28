'use client';

const levels = [
  { name: 'Poor', range: '0 – 50,000 EGP', note: 'Paycheck-to-paycheck; no buffer.' },
  { name: 'Struggling', range: '50,000 – 150,000 EGP', note: 'Tiny buffer; debt risk high.' },
  { name: 'Survival', range: '150,000 – 300,000 EGP', note: '1–2 months expenses saved.' },
  { name: 'Stable', range: '300,000 – 600,000 EGP', note: '3–6 months emergency fund.' },
  { name: 'Comfortable', range: '600,000 – 1.2M EGP', note: 'Room for planned purchases.' },
  { name: 'Secure', range: '1.2M – 3M EGP', note: 'Can absorb shocks; investing steadily.' },
  { name: 'Prosperous', range: '3M – 6M EGP', note: 'Multiple goals funded; low stress.' },
  { name: 'Mass Affluent', range: '6M – 10M EGP', note: 'Serious assets; lifestyle choice.' },
  { name: 'Rich', range: '10M – 20M EGP', note: 'Work is optional for many goals.' },
  { name: 'Very Rich', range: '20M – 50M EGP', note: 'Capital drives outcomes.' },
  { name: 'Wealthy', range: '50M – 80M EGP', note: 'Life funded by assets; margin of safety.' },
  { name: 'Financial Freedom', range: '80M+ EGP', note: 'Portfolio income covers life with cushion.' },
];

export default function WealthLevels(){
  return (
    <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-lg font-extrabold tracking-wide">Wealth Levels (EGP)</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {levels.map(l => (
          <div key={l.name} className="rounded-lg border border-black/10 p-3">
            <div className="text-base font-bold">{l.name}</div>
            <div className="text-sm opacity-70">{l.range}</div>
            <div className="mt-1 text-sm">{l.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
