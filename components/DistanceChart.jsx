"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";
import { getSocket } from "@/lib/socket";
import { ResetMaxValue } from "./ResetMaxValue";
import { ResetZoom } from "./ResetZoom";

/* ================= GLOBAL GUARD ================= */
let chartRegistered = false;

export default function DetectionDistanceChart({ resetSignal }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const dataRef = useRef([]);

  /* ================= CHART INIT ================= */
  useEffect(() => {
    let destroyed = false;

    const initChart = async () => {
      // ✅ dynamic import (MUST await)
      const zoomPlugin = (await import("chartjs-plugin-zoom")).default;

      // ✅ register ONLY once globally
      if (!chartRegistered) {
        Chart.register(...registerables, ChartDataLabels, zoomPlugin);
        chartRegistered = true;
      }

      if (!canvasRef.current || destroyed) return;

      // ✅ SAFETY: destroy any existing chart
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Detection Distance (Live)",
              data: [],
              borderWidth: 2,
              tension: 0.2,
              pointRadius: 0,
            },
          ],
        },
        options: {
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          parsing: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "second",
                tooltipFormat: "HH:mm:ss",
              },
              title: { display: true, text: "Time" },
            },
            y: {
              min: 0,
              max: 700,
              title: { display: true, text: "Detection Distance (cm)" },
            },
          },
          plugins: {
            legend: { display: false },
            zoom: {
              zoom: {
                wheel: { enabled: true },
                pinch: { enabled: true },
                mode: "x",
              },
              pan: { enabled: true, mode: "xy" },
            },
            datalabels: {
              display: (ctx) =>
                ctx.dataIndex === ctx.dataset.data.length - 1,
              formatter: (v) => `${v.y} cm`,
              align: "top",
              anchor: "end",
              offset: 8,
              font: { size: 20, weight: "bold" },
              color: "#f51919",
            },
          },
        },
      });
    };

    initChart();

    return () => {
      destroyed = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  /* ================= SOCKET DATA ================= */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (payload) => {
      if (!chartRef.current) return;

      const distance =
        typeof payload?.DetectionDistance === "number"
          ? payload.DetectionDistance
          : 0;

      dataRef.current.push({
        x: Date.now(),
        y: distance,
      });

      if (dataRef.current.length > 5000) {
        dataRef.current.shift();
      }

      chartRef.current.data.datasets[0].data = dataRef.current;
      chartRef.current.update("none");
    };

    socket.on("sensorData", handler);
    return () => socket.off("sensorData", handler);
  }, []);

  /* ================= RESET ZOOM ================= */
  useEffect(() => {
    if (resetSignal && chartRef.current) {
      chartRef.current.resetZoom();
    }
  }, [resetSignal]);

  return (
    <div className="w-full h-full">

      <canvas ref={canvasRef} />
    </div>
  );
}
