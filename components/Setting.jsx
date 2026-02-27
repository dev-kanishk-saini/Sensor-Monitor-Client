"use client";
import { useState } from "react";
import setSensitivityManual from "@/lib/setSensitivityManual";
import StartconfigButton from "./StartconfigButton";
import StopconfigButton from "./StopconfigButton";
import Loader from "./Loader";
import { getSocket } from "@/lib/socket";
import MovingSignalStrength from "@/components/MovingSingnalStrength";
import StaticSignalStrength from "@/components/StaticSignalStrength";



export default function Setting(){
       
          const [number, setNumber] = useState(0);
          const [motionvalue, setMotionvalue] = useState(0);
          const [staticvalue, setStaticvalue] = useState(0);
          const [config , setconfig] = useState(false);
    //      const [disabled, setDisabled] = useState(false);

          const numberOptions = [];
          for (let i = 0; i <= 7; i++) {
              numberOptions.push(<option key={i} value={i} className="text-black">{i}</option>);
          };

          const valueOptions = [];
          for (let i = 1; i <= 100; i++) {
              valueOptions.push(<option key={i} value={i} className="text-black">{i}</option>);
          }

       

        const applysettings = () => {
            setSensitivityManual(number , motionvalue, staticvalue);
        }

         const startConfig = () => {
         const socket = getSocket();
         socket.emit("task : control",{ action : "start"});
        // alert("▶ Starting Configuration Mode");
         setconfig(true);
         

    }
       
     const stopConfig = () => {
         const socket = getSocket();
          socket.emit("task : control",{ action : "stop"});
          //alert("⏸ Stopping Configuration Mode");
          setconfig(false);
    }
    return (
    <div className="flex gap-2 ">
        <div className="h-[320px] w-full bg-white border border-black text-center  rounded-lg p-4 ">
            
            <h1 className="font-semibold text-black text-lg mb-4">Set Sensitivity</h1>
            
            <label htmlFor="Select Gate" className=" font-medium text-black ">Select Gate</label>
            <select 
             name="Select gate"
             value={number}
             onChange={(e) => setNumber(e.target.value)}
             options={numberOptions}
             className=" border border-black text-black rounded-lg w-full">
             {numberOptions}
            </select>

             <label htmlFor="Select Gate" className=" font-medium text-black ">Motion Value</label>
            <select 
             name="Select gate"
             value={motionvalue}
             onChange={(e) => setMotionvalue(e.target.value)}
             options={valueOptions}
             className=" border border-black text-black rounded-lg w-full">
             {valueOptions}
            </select>

             <label htmlFor="Select Gate" className=" font-medium text-black ">Static Value</label>
            <select 
             name="Select gate"
             value={staticvalue}
             onChange={(e) => setStaticvalue(e.target.value)}
             options={valueOptions}
             className=" border border-black text-black rounded-lg w-full">
             {valueOptions}
            </select>

            <button 
            onClick={applysettings}
            className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90">
                Apply Settings
            </button>
        </div>
         <div className="h-[320px] w-full bg-white border border-black text-center rounded-lg p-4">
            <h1 className="font-semibold text-black text-lg ">Configure</h1>

            <div className="flex justify-center items-center gap-4 mt-8">
                <div className="flex justify-center items-center border border-black gap-5 rounded-full p-2">
                <StartconfigButton onClick={startConfig}
                disabled={config} /> 
                {config && <Loader/>}
                <StopconfigButton onClick={stopConfig}
                disabled={!config}/>
                </div>
                
            </div>
         </div>
         <div className="h-[320px] w-full bg-white border border-black text-center rounded-lg p-4">
            <h1 className="font-semibold text-black text-lg ">Rest Settings</h1>
             <div className="flex justify-center items-center gap-4 mt-8">
          <h2 className="text-sm font-bold text-center text-black mb-1">
           Moving<br>
           </br>
           Signal
           <br>
           </br>
           Strength
          </h2>
         <MovingSignalStrength/>
        </div>
        <div className="flex justify-center items-center gap-4 mt-8">
          <h2 className="text-sm font-bold text-center text-black mb-1">
           Static<br>
           </br>
           Signal
           <br>
           </br>
           Strength
          </h2>
         <StaticSignalStrength/>
        </div>
         </div>
    </div>
);
}   