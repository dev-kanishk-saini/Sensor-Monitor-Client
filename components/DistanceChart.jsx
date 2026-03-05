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






// "use client";

// import { useEffect, useRef } from "react";
// import { Chart, registerables } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import "chartjs-adapter-date-fns";
// import { getSocket } from "@/lib/socket";



// let chartRegistered = false;

// export default function DetectionDistanceChart({ resetSignal }) {

//   const canvasRef = useRef(null);
//   const chartRef = useRef(null);

//   // stores actual data
//   const dataRef = useRef([]);

//   // flag to indicate new data arrived
//   const needsUpdateRef = useRef(false);

//   // render loop id
//   const animationRef = useRef(null);

//   /* ================= INIT CHART ================= */

//   useEffect(() => {

//     let destroyed = false;

//     const initChart = async () => {

//       const zoomPlugin = (await import("chartjs-plugin-zoom")).default;

//       if (!chartRegistered) {
//         Chart.register(...registerables, ChartDataLabels, zoomPlugin);
//         chartRegistered = true;
//       }

//       if (!canvasRef.current || destroyed) return;

//       chartRef.current = new Chart(canvasRef.current, {

//         type: "line",

//         data: {
//           datasets: [{
//             label: "Detection Distance",
//             data: dataRef.current,
//             borderWidth: 2,
//             tension: 0.2,
//             pointRadius: 0,
//           }]
//         },

//         options: {
//           animation: false,
//           responsive: true,
//           maintainAspectRatio: false,
//           parsing: false,

//           scales: {
//             x: { type: "time" },
//             y: { min: 0, max: 700 }
//           },

//           plugins: {
//             legend: { display: false }
//           }
//         }

//       });

//     };

//     initChart();

//     return () => {
//       destroyed = true;
//       chartRef.current?.destroy();
//     };

//   }, []);

//   /* ================= SOCKET INGESTION ================= */

//   useEffect(() => {

//     const socket = getSocket();
//     if (!socket) return;

//     const handler = (payload) => {

//       const distance = payload?.DetectionDistance ?? 0;

//       dataRef.current.push({
//         x: Date.now(),
//         y: distance
//       });

//       // limit points (IMPORTANT)
//       if (dataRef.current.length > 1000) {
//         dataRef.current.shift();
//       }

//       // mark that chart needs update
//       needsUpdateRef.current = true;

//     };

//     socket.on("sensorData", handler);

//     return () => socket.off("sensorData", handler);

//   }, []);

//   /* ================= CONTROLLED RENDER LOOP ================= */

//   useEffect(() => {

//     let lastUpdateTime = 0;

//     const FPS = 10;
//     const interval = 1000 / FPS;

//     const renderLoop = (time) => {

//       if (
//         needsUpdateRef.current &&
//         chartRef.current &&
//         time - lastUpdateTime > interval
//       ) {

//         chartRef.current.update("none");

//         needsUpdateRef.current = false;
//         lastUpdateTime = time;
//       }

//       animationRef.current = requestAnimationFrame(renderLoop);

//     };

//     animationRef.current = requestAnimationFrame(renderLoop);

//     return () =>
//       cancelAnimationFrame(animationRef.current);

//   }, []);

//   /* ================= RESET ZOOM ================= */

//   useEffect(() => {

//     if (resetSignal && chartRef.current) {
//       chartRef.current.resetZoom();
//     }

//   }, [resetSignal]);

//   return <canvas ref={canvasRef} />;
// }



// "use client";

// import { useEffect, useRef } from "react";
// import { Chart, registerables } from "chart.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import "chartjs-adapter-date-fns";
// import { useRealtimeStore } from "@/store/realtimestore";

// /* ================= REGISTER GUARD ================= */

// let chartRegistered = false;

// export default function DetectionDistanceChart({ resetSignal }) {

//   const canvasRef = useRef(null);
//   const chartRef = useRef(null);

//   /* store local copy of plotted points */
//   const dataRef = useRef([]);

//   /* animation batching */
//   const animationRef = useRef(null);

//   /* Zustand store subscription */
//   const detectionDistance = useRealtimeStore(
//     state => state.detectionDistance
//   );

//   /* ================= INIT CHART ================= */

//   useEffect(() => {

//     let destroyed = false;

//     const initChart = async () => {

//       const zoomPlugin =
//         (await import("chartjs-plugin-zoom")).default;

//       if (!chartRegistered) {

//         Chart.register(
//           ...registerables,
//           ChartDataLabels,
//           zoomPlugin
//         );

//         chartRegistered = true;
//       }

//       if (!canvasRef.current || destroyed) return;

//       chartRef.current = new Chart(canvasRef.current, {

//         type: "line",

//         data: {

//           datasets: [

//             {
//               label: "Detection Distance",
//               data: dataRef.current,
//               borderWidth: 2,
//               tension: 0.2,
//               pointRadius: 0,
//             },

//           ],

//         },

//         options: {

//           animation: false,

//           responsive: true,

//           maintainAspectRatio: false,

//           parsing: false,

//           scales: {

//             x: {

//               type: "time",

//               time: {
//                 unit: "second",
//                 tooltipFormat: "HH:mm:ss",
//               },

//               title: {
//                 display: true,
//                 text: "Time",
//               },

//             },

//             y: {

//               min: 0,
//               max: 700,

//               title: {
//                 display: true,
//                 text: "Detection Distance (cm)",
//               },

//             },

//           },

//           plugins: {

//             legend: { display: false },

//             zoom: {

//               zoom: {
//                 wheel: { enabled: true },
//                 pinch: { enabled: true },
//                 mode: "x",
//               },

//               pan: {
//                 enabled: true,
//                 mode: "xy",
//               },

//             },

//             datalabels: {

//               display: ctx =>
//                 ctx.dataIndex ===
//                 ctx.dataset.data.length - 1,

//               formatter: v => `${v.y} cm`,

//               align: "top",

//               anchor: "end",

//               offset: 8,

//               font: {
//                 size: 20,
//                 weight: "bold",
//               },

//               color: "#f51919",

//             },

//           },

//         },

//       });

//     };

//     initChart();

//     return () => {

//       destroyed = true;

//       chartRef.current?.destroy();

//       chartRef.current = null;

//     };

//   }, []);

//   /* ================= STORE → DATA INGESTION ================= */

//   useEffect(() => {

//     if (detectionDistance == null) return;

//     dataRef.current.push({

//       x: Date.now(),

//       y: Number(detectionDistance) || 0,

//     });

//     /* limit memory */

//     if (dataRef.current.length > 1000)
//       dataRef.current.shift();

//     /* schedule batched render */

//     if (animationRef.current)
//       cancelAnimationFrame(animationRef.current);

//     animationRef.current =
//       requestAnimationFrame(() => {

//         if (!chartRef.current) return;

//         chartRef.current.update("none");

//       });

//   }, [detectionDistance]);

//   /* ================= RESET ZOOM ================= */

//   useEffect(() => {

//     if (resetSignal && chartRef.current)
//       chartRef.current.resetZoom();

//   }, [resetSignal]);

//   return (

//     <div className="w-full h-full">

//       <canvas ref={canvasRef} />

//     </div>

//   );

// }