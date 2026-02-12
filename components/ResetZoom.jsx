"use client";

import React from "react";

export function ResetZoom({reset}){

    return (
    <button
         onClick={reset}
         className="h-5 w-20 bg-blue-500 hover:bg-red-700 text-xs text-white font-semibold rounded"
         >Reset Zoom</button>
        );

}