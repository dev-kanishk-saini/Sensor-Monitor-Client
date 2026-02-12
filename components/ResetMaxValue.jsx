"use client"


import React from "react";



export function ResetMaxValue({resetMAX}) {
     
    return (
    <button className="h-5 w-20 bg-red-500 hover:bg-red-700 text-xs text-white font-semibold  rounded" onClick={resetMAX}>Reset Max Value</button>
)
}