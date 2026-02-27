"use client"

import MotionChart from "@/components/MotionChart";
import StaticChart from "@/components/StaticChart";
import DetectionDistanceChart from "@/components/DistanceChart";
import Setting from "@/components/Setting";
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { ResetMaxValue } from "@/components/ResetMaxValue";
import { ResetZoom } from "@/components/ResetZoom";




 

export default function RealtimePage() {
  const resetZoomTrigger = Date.now();
  //const [motionthreshold , setMotionthreshold] = useState([0,0,0,0,0,0,0,0]);
 // const [staticthreshold , setStaticthreshold] = useState([0,0,0,0,0,0,0,0]);
   
  



  return (
    <div className="p-4 bg-white min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {/* Motion */}
        <div className="h-[390px] border border-black rounded-lg p-2 shadow-lg">
       
          <h2 className="text-m font-bold text-center text-black mb-1">
            Motion Gates
          </h2>
          <MotionChart/>
        </div>

        {/* Static */}
        <div className="h-[390px] border border-black rounded-lg p-2 shadow-lg">
          <h2 className="text-m font-bold text-center text-black mb-1">
            Static Gates
          </h2>
          <StaticChart/>
        </div>

        {/* Distance (full row) */}
        <div className="h-[380px] border border-black rounded-lg p-2 shadow-lg">
          <div className="flex justify-center items-center"> <ResetZoom /> 
          <h2 className="text-m font-bold text-center text-black mb-1">
            Detection Distance
          </h2></div>
          
          <DetectionDistanceChart />
        </div>

 {/* Settings  */}
        <div className="h-[380px] border border-black rounded-lg p-2 shadow-lg">
          <h2 className="text-m font-bold text-center text-black mb-1">
           Settings
          </h2>
          <Setting/>
        </div>

      </div>
    </div>
  );
}
    