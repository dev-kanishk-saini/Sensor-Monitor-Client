"use client";

import { useState } from "react";
import { getSocket } from "@/lib/socket";
import DataDisplay from "@/components/DataDisplay";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const socket = getSocket();

export default function DataViewer() {

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [data, setData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  
      

     


  const selectedData = data[selectedIndex];

  return (
    <div className="p-10 border-solid border-2 border-white rounded-lg ">

      <h1 className="text-2xl font-bold  mb-10">Select the Date and Time to View Data.</h1>

      <div className="flex" >
        <div className="m-5">
             <label style={{ marginRight: "10px" }}>Select Date:</label>
        <DatePicker
          className="border-solid border-2 border-white rounded-lg p-2"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
        />
        </div>
       
        <div className="m-5">
           <label style={{ marginRight: "10px" }}>Select Time:</label>
        <DatePicker
          className="border-solid border-2 border-white rounded-lg p-2"
          selected={time}
          onChange={(time) => setTime(time)}
          dateFormat="HH:mm"
        />
        </div>
       
      </div>

    </div>
  );
}