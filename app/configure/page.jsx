"use client";

import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider";

// dynamic imports (CRITICAL FIX)
const DatePicker = dynamic(
  () => import("react-datepicker"),
  { ssr: false }
);

const TimePicker = dynamic(
  () => import("@/components/TimePickerComponent"),
  { ssr: false }
);

const ConfigureMotionChart = dynamic(
  () => import("@/components/ConfigureMotionChart").then(mod => mod.ConfigureMotionChart),
  { ssr: false }
);

const ConfigureStaticChart = dynamic(
  () => import("@/components/ConfigureStaticChart").then(mod => mod.ConfigureStaticChart),
  { ssr: false }
);

const DistanceSlider = dynamic(
  () => import("@/components/DistanceSlider").then(mod => mod.DistanceSlider),
  { ssr: false }
);

import "react-datepicker/dist/react-datepicker.css";
import { set } from "date-fns";







export default function ConfigurePage() {

  // hydration safety flag
  const [mounted, setMounted] = useState(false);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [data, setData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [socket, setSocket] = useState(null);

  const [motionchartData , setMotionchartData] = useState([
    { Gate: "Gate 0", value: 0, threshold: 70 },
  { Gate: "Gate 1", value: 0, threshold: 70 },
  { Gate: "Gate 2", value: 0, threshold: 70 },
  { Gate: "Gate 3", value: 0, threshold: 70 },
  { Gate: "Gate 4", value: 0, threshold: 70 },
  { Gate: "Gate 5", value: 0, threshold: 70 },
  { Gate: "Gate 6", value: 0, threshold: 70 },
  { Gate: "Gate 7", value: 0, threshold: 70 },]);
  const [staticchartData , setStaticchartData]= useState([
    { Gate: "Gate 0", value: 0, threshold: 40 },
  { Gate: "Gate 1", value: 0, threshold: 40 },
  { Gate: "Gate 2", value: 0, threshold: 40 },
  { Gate: "Gate 3", value: 0, threshold: 40 },
  { Gate: "Gate 4", value: 0, threshold: 40 },
  { Gate: "Gate 5", value: 0, threshold: 40 },
  { Gate: "Gate 6", value: 0, threshold: 40 },
  { Gate: "Gate 7", value: 0, threshold: 40 },
  ]);
 const [detectiondistance , setDetectiondistance] = useState(0);








  // ensure client-only execution
  useEffect(() => {

    setMounted(true);

    const { getSocket } = require("@/lib/socket");
    const socketInstance = getSocket();

    setSocket(socketInstance);

    socketInstance.on("latestData", (data) => {
      console.log("Received data:", data);
      setData(data);
      
      
     
    });

    return () => {
      socketInstance.off("latestData");
    };

  }, []);

  const updateCharts = (incomingData, index) => {
  if (!incomingData || incomingData.length === 0) return;

  const selected = incomingData[index]; // because Slider gives array

  if (!selected) return;

  const newMotion = motionchartData.map((item, i) => ({
    ...item,
    value: selected.motiongatevalues?.[i] ?? 0,
  }));

  const newStatic = staticchartData.map((item, i) => ({
    ...item,
    value: selected.staticgatevalues?.[i] ?? 0,
  }));

  setMotionchartData(newMotion);
  setStaticchartData(newStatic);
  setDetectiondistance(selected.detectiondistance ?? 0);
};
   

  useEffect(() => {
    if (data.length === 0) return;
    console.log(selectedIndex);
    // console.log("Selected index data:", data[selectedIndex]?.motiongatevalues, data[selectedIndex]?.staticgatevalues , data[selectedIndex]?.detectiondistance);
    // motionchartData.forEach((value, index) => {
    //      motionchartData[index].value = data[selectedIndex]?.motiongatevalues ? data[selectedIndex].motiongatevalues[index] : 0;
    // });
    //  staticchartData.forEach((value, index) => {
    //      staticchartData[index].value = data[selectedIndex]?.staticgatevalues ? data[selectedIndex].staticgatevalues[index] : 0;
    // });
    //   setDetectiondistance(data[selectedIndex]?.detectiondistance ? data[selectedIndex].detectiondistance : 0);
    // console.log("Updated motion chart data:", motionchartData);
    // console.log("Updated static chart data:", staticchartData);
    // console.log("Updated detection distance:", detectiondistance);

    updateCharts(data,selectedIndex)

  },[data,selectedIndex]);


  const fetchData = () => {

    if (!socket) return;

    socket.emit("getData");
    

    console.log("Data request sent");

  };

  // prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="p-10">

      <div className="flex  items-start">

        <div className="flex-col  items-start border-solid border-2 border-white p-3 rounded-lg">

          <div className="flex">
           <div className="m-5 w-full flex flex-col ">

            <label className="mr-2">Select Date:</label>
           

            <DatePicker
              className="border-solid border-1 border-white rounded-lg p-1"
              selected={date}
              onChange={setDate}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select date"
            />

          </div>

          <div className="m-5 w-full flex flex-col">

            <label className="mr-2">Select Time:</label>

            <TimePicker
              value={time}
              onChange={setTime}
            />

          </div>
          
          
          </div>
          <div className="flex">
                 <div className="w-full flex  items-start">
              <Button
            className="m-5 bg-black text-white"
            variant="outline"
            onClick={fetchData}
          >
            Fetch Data
          </Button>
          </div>
           <div className="w-full flex justify-center items-center p-5">
          {
            data.length > 0 ? ( 
              <div className="flex flex-col w-full">
                <span className="text-sm font-bold text-muted-foreground">{selectedIndex}</span>
              
                 <Slider
              
           value={[selectedIndex]}
           onValueChange={(value) => setSelectedIndex(value[0])}
           min={0}
           max={data.length - 1}
           step={1}/>
            
              </div>

            )  : <p className="text-white w-full text-sm border-solid border-1 border-white p-2 rounded-lg bg-red-500">No data available.
            Please fetch data.</p>
          }
          
        </div>
          </div>
          
          

        </div>
        
            
      </div>

      <div className="mt-10 flex  items-start gap-10">

     

        <ConfigureMotionChart chartData={motionchartData} />

        <ConfigureStaticChart chartData={staticchartData} />

        

      </div>

      <div className="m-5  w-full flex  items-start">

        <DistanceSlider value={detectiondistance} />

      </div>

    </div>
  );
}