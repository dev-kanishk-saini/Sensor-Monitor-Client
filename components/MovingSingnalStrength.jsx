"use client";

import { Gauge } from "@mui/x-charts/Gauge";
import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";

const socket = getSocket();

export default function MovingSignalStrength() {
  const [value, setValue] = useState(50);

  // Simulate realtime updates (replace with your sensor data)
    useEffect(() => { 
        socket.on("sensorData", (data) => {
          
            setValue(data.MovingTargetSignalStrength);

        });
      });

  return (
    <div style={{ width: 100, height: 100 }}>
      <Gauge
        value={value}
        valueMin={0}
        valueMax={100}
        startAngle={0}
        endAngle={360}
        innerRadius="80%"
        outerRadius="100%"
        text={({ value }) => `${value}`}
      />
    </div>
  );
}