"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { ResetMaxValue } from "./ResetMaxValue";
import {resetMaxmotion} from "@/lib/resetMAX";
import { useRealtimeStore } from "@/store/realtimestore";

import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import ChartDataLabels from "chartjs-plugin-datalabels";

/* ---------------- REGISTER ONCE ---------------- */
Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  ScatterController,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function MotionChart({ motionthreshold }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const gateLabels = [
   "Gate 0", "Gate 1","Gate 2","Gate 3","Gate 4",
    "Gate 5","Gate 6","Gate 7",
  ];

  /* ---------------- SANITIZER ---------------- */
  const sanitizeVal = (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(120, Math.round(n)));
  };

  /* ---------------- CREATE CHART ---------------- */
  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: gateLabels,
        datasets: [
          // 🔵 LIVE MOTION
          {
            label: "Motion Gate Signal",
            data: Array(8).fill(0),
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 5,
            borderColor: "#000",
            backgroundColor: "rgba(0,0,0,0.85)",
            datalabels: {
              display: true,
              anchor: "end",
              align: "bottom",
              offset: -18,
              color: "#f51919",
              font: { size: 16, weight: "bold" },
            },
          },

          // 🟠 THRESHOLD
          {
            label: "Motion Threshold",
            data: Array(8).fill(0),
            borderDash: [6, 6],
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
            borderColor: "#555",
            backgroundColor: "rgba(0,0,0,0.1)",
            datalabels: { display: false },
          },

          // 🟢 MAX HIT (SCATTER)
          {
            type: "scatter",
            label: "Max Value Hit",
            data: [],
            parsing: false,
            pointRadius: 5,
            pointHoverRadius: 7,
            showLine: false,
            backgroundColor: "#111",
            borderColor: "#111",
            datalabels: {
              display: true,
              align: "top",
              offset: 8,
              color: "#000",
              font: { size: 14, weight: "bold" },
              formatter: (v) => (v?.y ?? ""),
            },
          },
        ],
      },
      options: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "category",
            ticks: { color: "#000" },
            title: { display: true, text: "Gate", color: "#000" },
          },
          y: {
            min: 0,
            max: 120,
            ticks: { color: "#000" },
            title: { display: true, text: "Signal (0–120)", color: "#000" },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);


useEffect(() => {

  const socket = getSocket();

  const handleSensorData = (payload) => {

    const chart = chartRef.current;
    if (!chart) return;

    const motionRaw = payload.MotionGateValues ?? [];
    const maxmotion = payload.maxmotionvalues ?? [];

    const motionArr = motionRaw.slice(0, 8).map(sanitizeVal);

    const markers = [];

    maxmotion.slice(0, 8).forEach((v, i) => {
      if (!Number.isNaN(Number(v))) {
        markers.push({
          x: gateLabels[i],
          y: sanitizeVal(v),
        });
      }
    });

    chart.data.datasets[0].data = motionArr;
    chart.data.datasets[2].data = markers;

    chart.update("none");
  };


  const handleConfigurationData = (config) => {

    const chart = chartRef.current;
    if (!chart) return;

    const thresholds = config.motionSensitivity
      ?.slice(0, 8)
      .map(sanitizeVal);

    chart.data.datasets[1].data = thresholds;

    chart.update("none");
  };


  const handleSensitivityUpdated = (data) => {

    const chart = chartRef.current;
    if (!chart) return;

    const thresholds = data.MotionSensitivity
      ?.slice(0, 8)
      .map(sanitizeVal);

    chart.data.datasets[1].data = thresholds;

    chart.update("none");
  };


  socket.on("sensorData", handleSensorData);
  socket.on("configurationData", handleConfigurationData);
  socket.on("sensitivityUpdated", handleSensitivityUpdated);


  return () => {

    socket.off("sensorData", handleSensorData);
    socket.off("configurationData", handleConfigurationData);
    socket.off("sensitivityUpdated", handleSensitivityUpdated);

  };

}, []);




  return (
    <div className="h-[340px] w-full bg-white border border-black rounded-lg p-4">
       <ResetMaxValue resetMAX={resetMaxmotion} />
      <canvas ref={canvasRef} />
    </div>
  );
}


// "use client";

// import { useEffect, useRef } from "react";
// import { ResetMaxValue } from "./ResetMaxValue";
// import { resetMaxmotion } from "@/lib/resetMAX";
// import { useRealtimeStore } from "@/store/realtimestore";

// import {
//   Chart,
//   BarController,
//   BarElement,
//   LineController,
//   LineElement,
//   ScatterController,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import ChartDataLabels from "chartjs-plugin-datalabels";

// /* ---------------- REGISTER ONCE ---------------- */
// Chart.register(
//   BarController,
//   BarElement,
//   LineController,
//   LineElement,
//   ScatterController,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   ChartDataLabels
// );

// export default function MotionChart() {

//   const canvasRef = useRef(null);
//   const chartRef = useRef(null);

//   /* ================= STORE SUBSCRIPTIONS ================= */

//   const MotionGateValues = useRealtimeStore(
//     (state) => state.MotionGateValues
//   );

//   const maxmotionvalues = useRealtimeStore(
//     (state) => state.maxmotionvalues
//   );

//   const motionSensitivity = useRealtimeStore(
//     (state) => state.motionSensitivity
//   );

//   /* ---------------- LABELS ---------------- */

//   const gateLabels = [
//     "Gate 0",
//     "Gate 1",
//     "Gate 2",
//     "Gate 3",
//     "Gate 4",
//     "Gate 5",
//     "Gate 6",
//     "Gate 7",
//   ];

//   /* ---------------- SANITIZER ---------------- */

//   const sanitizeVal = (v) => {

//     const n = Number(v);

//     if (Number.isNaN(n)) return 0;

//     return Math.max(0, Math.min(120, Math.round(n)));

//   };

//   /* ================= CREATE CHART ================= */

//   useEffect(() => {

//     if (!canvasRef.current) return;

//     chartRef.current = new Chart(canvasRef.current, {

//       type: "bar",

//       data: {

//         labels: gateLabels,

//         datasets: [

//           /* LIVE MOTION */
//           {
//             label: "Motion Gate Signal",
//             data: Array(8).fill(0),
//             borderWidth: 2,
//             borderColor: "#000",
//             backgroundColor: "rgba(0,0,0,0.85)",

//             datalabels: {
//               display: true,
//               anchor: "end",
//               align: "bottom",
//               offset: -18,
//               color: "#f51919",
//               font: { size: 16, weight: "bold" },
//             },
//           },

//           /* THRESHOLD */
//           {
//             label: "Motion Threshold",
//             data: Array(8).fill(0),
//             borderDash: [6, 6],
//             borderWidth: 2,
//             borderColor: "#555",
//             backgroundColor: "rgba(0,0,0,0.1)",
//             datalabels: { display: false },
//           },

//           /* MAX HIT */
//           {
//             type: "scatter",
//             label: "Max Value Hit",
//             data: [],
//             parsing: false,
//             pointRadius: 5,
//             pointHoverRadius: 7,
//             showLine: false,
//             backgroundColor: "#111",
//             borderColor: "#111",

//             datalabels: {

//               display: true,

//               align: "top",

//               offset: 8,

//               color: "#000",

//               font: { size: 14, weight: "bold" },

//               formatter: (v) => (v?.y ?? ""),

//             },

//           },

//         ],

//       },

//       options: {

//         animation: false,

//         responsive: true,

//         maintainAspectRatio: false,

//         scales: {

//           x: {

//             type: "category",

//             ticks: { color: "#000" },

//             title: {

//               display: true,

//               text: "Gate",

//               color: "#000",

//             },

//           },

//           y: {

//             min: 0,

//             max: 120,

//             ticks: { color: "#000" },

//             title: {

//               display: true,

//               text: "Signal (0–120)",

//               color: "#000",

//             },

//           },

//         },

//         plugins: {

//           legend: { display: false },

//         },

//       },

//     });

//     return () => {

//       chartRef.current?.destroy();

//       chartRef.current = null;

//     };

//   }, []);

//   /* ================= STORE → CHART UPDATE ================= */

//   useEffect(() => {

//     const chart = chartRef.current;

//     if (!chart) return;

//     /* MOTION VALUES */

//     const motionArr =
//       MotionGateValues
//         .slice(0, 8)
//         .map(sanitizeVal);

//     /* MAX VALUES */

//     const markers = [];

//     maxmotionvalues
//       .slice(0, 8)
//       .forEach((v, i) => {

//         if (!Number.isNaN(Number(v))) {

//           markers.push({

//             x: gateLabels[i],

//             y: sanitizeVal(v),

//           });

//         }

//       });

//     /* THRESHOLD */

//     const thresholds =
//       motionSensitivity
//         .slice(0, 8)
//         .map(sanitizeVal);

//     /* APPLY TO CHART */

//     chart.data.datasets[0].data = motionArr;

//     chart.data.datasets[1].data = thresholds;

//     chart.data.datasets[2].data = markers;

//     chart.update("none");

//   }, [

//     MotionGateValues,

//     maxmotionvalues,

//     motionSensitivity,

//   ]);

//   /* ================= UI ================= */

//   return (

//     <div className="h-[340px] w-full bg-white border border-black rounded-lg p-4">

//       <ResetMaxValue resetMAX={resetMaxmotion} />

//       <canvas ref={canvasRef} />

//     </div>

//   );

// }