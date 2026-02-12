"use client";

export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border border-white px-8 py-4 ">
           <h1 className="text-2xl font-semibold text-white mb-4 ">
        Realtime Sensor Analysis
      </h1>

      <div className="text-xs text-muted">
        Connected
      </div>
    </header>
  );
}
