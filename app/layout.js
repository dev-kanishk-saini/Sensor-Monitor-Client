"use client";
import "./globals.css";
import LayoutShell from "../components/LayoutShell";
import { use, useEffect , useRef  } from "react";
import { getSocket } from "@/lib/socket";
import { INIT_CMD } from "@/constants.js";



export default function RootLayout({ children }) {

   // Initialize Eng Mode of the sensor on first load.

  const initialized = useRef(false);

  useEffect(() => {

   if (initialized.current) return;
    initialized.current = true;

    getSocket().emit("sendCommand", INIT_CMD);
    console.log("✅ Init command sent to sensor");

  },[]);

  return (
    <html lang="en">
      <body>
  
          <LayoutShell>
            {children}
          </LayoutShell>
      
      </body>
    </html>
  );
}

