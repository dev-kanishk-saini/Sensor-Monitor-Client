"use client";

import { create } from "zustand";

/*
Central realtime state store

This store holds ALL realtime sensor data.

Charts subscribe to this store instead of socket.
*/

export const useRealtimeStore = create((set) => ({

  /* ================= SENSOR DATA ================= */

  MotionGateValues: Array(8).fill(0),
  StaticGateValues: Array(8).fill(0),

  maxmotionvalues: Array(8).fill(0),
  maxstaticvalues: Array(8).fill(0),

  DetectionDistance: 0,

  /* ================= CONFIG DATA ================= */

  motionSensitivity: Array(8).fill(0),
  staticSensitivity: Array(8).fill(0),

  /* ================= UPDATE FUNCTIONS ================= */

  setSensorData: (payload) =>
    set({

      MotionGateValues: payload.MotionGateValues ?? Array(8).fill(0),

      StaticGateValues: payload.StaticGateValues ?? Array(8).fill(0),

      maxmotionvalues: payload.maxmotionvalues ?? Array(8).fill(0),

      maxstaticvalues: payload.maxstaticvalues ?? Array(8).fill(0),

      DetectionDistance: payload.DetectionDistance ?? 0,

    }),

  setConfigurationData: (config) =>
    set({

      motionSensitivity: config.motionSensitivity ?? Array(8).fill(0),

      staticSensitivity: config.staticSensitivity ?? Array(8).fill(0),

    }),

  setSensitivityUpdated: (data) =>
    set({

      motionSensitivity:
        data.MotionSensitivity ??
        Array(8).fill(0),

      staticSensitivity:
        data.StaticSensitivity ??
        Array(8).fill(0),

    }),

}));