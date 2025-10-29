'use client';

export default function Goodbye(){
  return (
    <main className="grid min-h-[100svh] place-items-center bg-white text-black p-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold">You can close this tab now.</h1>
        <p className="mt-2 text-sm opacity-70">GAIA session ended. Return with the GAIA icon or navigate to <code>/</code>.</p>
      </div>
    </main>
  );
}
