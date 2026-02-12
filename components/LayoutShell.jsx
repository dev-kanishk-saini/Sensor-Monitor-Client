"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { getSocket } from "@/lib/socket";

export default function LayoutShell({ children }) {



  return (
    <div className="flex h-screen w-full flex-col bg-black">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-surface px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
