"use client";
import { use, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";


const socket = getSocket();

export default function Navbar() {

         const [connectionStatus, setConnectionStatus] = useState("Connecting...");
         const [occupiedStatus, setOccupiedStatus] = useState(true);
         useEffect(() => {
           if (!socket) {
              setConnectionStatus("No socket connection");
           }else{
            setConnectionStatus("Connected");
           }
         },[socket]);
  return (
    <header className="flex h-14 items-center justify-between border border-white px-8 py-4 ">
           <h1 className="text-2xl font-semibold text-white m-4 ">
        Realtime Sensor Analysis
      </h1>
      <div>
          {occupiedStatus  ? (
            <div className="bg-white text-green-500 px-3 py-1 rounded-md text-lg font-semibold">
              PRESENCE...
            </div>
          ) : (
            <div className="bg-white text-red-500 px-3 py-1 rounded-md text-lg font-semibold">
              ABSENCE
            </div>
          )}    
      </div>
      <div className="text-m text-muted">
        {connectionStatus}
      </div>
    </header>
  );
}
