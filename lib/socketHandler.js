"use client";

import { getSocket } from "./socket";
import { useRealtimeStore } from "@/store/realtimestore";

/*
Singleton socket handler

This ensures socket listeners are attached ONLY ONCE
*/

let initialized = false;

export function initSocketHandler() {

  if (initialized) return;

  const socket = getSocket();

  if (!socket) return;

  const store = useRealtimeStore.getState();

  /* ================= SENSOR DATA ================= */

  socket.on("sensorData", (payload) => {

    useRealtimeStore.getState().setSensorData(payload);

  });

  /* ================= CONFIG DATA ================= */

  socket.on("configurationData", (config) => {

    useRealtimeStore
      .getState()
      .setConfigurationData(config);

  });

  /* ================= SENSITIVITY UPDATED ================= */

  socket.on("sensitivityUpdated", (data) => {

    useRealtimeStore
      .getState()
      .setSensitivityUpdated(data);

  });

  initialized = true;

  console.log("Socket Handler Initialized");

}