"use client";

import { useEffect, useRef , useState} from "react";
import { getSocket } from "@/lib/socket";
import { resetMaxstatic } from "@/lib/resetMAX";


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
import { ResetMaxValue } from "./ResetMaxValue";

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

export default function StaticChart({ staticthreshold }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [StaticSensitivity, setStaticSensitivity] = useState([10,10,10,10,0,0,0,0]);

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
          // 🔵 LIVE STATIC
          {
            label: "Static Gate Signal",
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
            label: "Static Threshold",
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

  // const socket = getSocket();
  /* ---------------- SOCKET UPDATES ---------------- */
  // useEffect(() => {
    
  //   if (!chartRef.current) return;

  //   socket.on("sensorData", (payload) => {
  //     const staticRaw = payload.StaticGateValues ?? [];
  //     const maxstatic = payload.maxstaticvalues ?? [];

  //     const staticArr = staticRaw.slice(0, 8).map(sanitizeVal);

  //     const markers = [];
  //     maxstatic.slice(0, 8).forEach((v, i) => {
  //       if (!Number.isNaN(Number(v))) {
  //         markers.push({
  //           x: gateLabels[i],
  //           y: sanitizeVal(v),
  //         });
  //       }
  //     });

  //     chartRef.current.data.datasets[0].data = staticArr;
  //     chartRef.current.data.datasets[2].data = markers;
  //     chartRef.current.update("none");
  //   });

  //   socket.on("configurationData", (config) => {
  //     const thresholds = config.staticSensitivity
  //       ?.slice(0, 8)
  //       .map(sanitizeVal);

  //     chartRef.current.data.datasets[1].data = thresholds;
  //     chartRef.current.update();
  //   });
  //   //     chartRef.current.data.datasets[1].data = staticthreshold;
  //     // chartRef.current.update();
  //   return () => {
  //     socket.off("sensorData");
  //     socket.off("configurationData");
  //   };
  // }, []);

  //  socket.on("sensitivityUpdated", (data) => {
  //     const thresholds = data.StaticSensitivity
  //       ?.slice(0, 8)
  //       .map(sanitizeVal);

  //     chartRef.current.data.datasets[1].data = thresholds;
  //     chartRef.current.update();
  //   });



useEffect(() => {

  const socket = getSocket();

  const handleSensorData = (payload) => {

    if (!chartRef.current) return;

    const staticRaw = payload.StaticGateValues ?? [];
    const maxstatic = payload.maxstaticvalues ?? [];

    const staticArr = staticRaw.slice(0, 8).map(sanitizeVal);

    const markers = [];

    maxstatic.slice(0, 8).forEach((v, i) => {
      if (!Number.isNaN(Number(v))) {
        markers.push({
          x: gateLabels[i],
          y: sanitizeVal(v),
        });
      }
    });

    chartRef.current.data.datasets[0].data = staticArr;
    chartRef.current.data.datasets[2].data = markers;

    chartRef.current.update("none");
  };


  const handleConfiguration = (config) => {

    if (!chartRef.current) return;

    const thresholds = config.staticSensitivity
      ?.slice(0, 8)
      .map(sanitizeVal);

       // console.log("Received StaticSensitivity:", thresholds);
      //  setStaticSensitivity(thresholds); 
     //   console.log("Updated StaticSensitivity state:", StaticSensitivity);

    chartRef.current.data.datasets[1].data = thresholds;

    chartRef.current.update("none");
  };


  const handleSensitivityUpdated = (data) => {

    if (!chartRef.current) return;

    const thresholds = data.StaticSensitivity
      ?.slice(0, 8)
      .map(sanitizeVal);

    chartRef.current.data.datasets[1].data = thresholds;

    chartRef.current.update("none");
  };


  socket.on("sensorData", handleSensorData);
  socket.on("configurationData", handleConfiguration);
  socket.on("sensitivityUpdated", handleSensitivityUpdated);


  return () => {

    socket.off("sensorData", handleSensorData);
    socket.off("configurationData", handleConfiguration);
    socket.off("sensitivityUpdated", handleSensitivityUpdated);

  };

}, []);








  return (
    <div className="h-[340px] w-full bg-white border border-black rounded-lg p-4">
      <ResetMaxValue resetMAX={resetMaxstatic} />
      <canvas ref={canvasRef} />
    </div>
  );
}



// "use client";

// import { useEffect, useRef } from "react";
// import { ResetMaxValue } from "./ResetMaxValue";
// import { resetMaxstatic } from "@/lib/resetMAX";
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

//   const StaticGateValues = useRealtimeStore(
//     (state) => state.MotionGateValues
//   );

//   const maxstaticvalues = useRealtimeStore(
//     (state) => state.maxstaticvalues
//   );

//   const staticSensitivity = useRealtimeStore(
//     (state) => state.staticSensitivity
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

//     /* STATIC VALUES */

//     const staticArr =
//       StaticGateValues
//         .slice(0, 8)
//         .map(sanitizeVal);

//     /* MAX VALUES */

//     const markers = [];

//     maxstaticvalues
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
//       staticSensitivity
//         .slice(0, 8)
//         .map(sanitizeVal);

//     /* APPLY TO CHART */

//     chart.data.datasets[0].data = staticArr;

//     chart.data.datasets[1].data = thresholds;

//     chart.data.datasets[2].data = markers;

//     chart.update("none");

//   }, [

//     StaticGateValues,

//     maxstaticvalues,

//     staticSensitivity,

//   ]);

//   /* ================= UI ================= */

//   return (

//     <div className="h-[340px] w-full bg-white border border-black rounded-lg p-4">

//       <ResetMaxValue resetMAX={resetMaxstatic} />

//       <canvas ref={canvasRef} />

//     </div>

//   );

// }