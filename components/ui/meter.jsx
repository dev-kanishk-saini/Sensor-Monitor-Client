"use client";
import * as React from "react"
import { Meter as AriaMeter, composeRenderProps } from "react-aria-components";

import { cn } from "@/lib/utils"

import { Label, labelVariants } from "@/components/ui/label"


const Meter = ({
  className,
  barClassName,
  fillClassName,
  children,
  ...props
}) => (
  <AriaMeter
    className={composeRenderProps(className, (className) =>
      cn("w-full", className))}
    {...props}>
    {composeRenderProps(children, (children, renderProps) => (
      <>
        {children}
        <div
          className={cn(
            "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
            barClassName
          )}>
          <div
            className={cn("size-full flex-1 bg-primary transition-all", fillClassName)}
            style={{
              transform: `translateX(-${100 - (renderProps.percentage || 0)}%)`,
            }} />
        </div>
      </>
    ))}
  </AriaMeter>
)

function JollyMeter({
  label,
  className,
  showValue = true,
  value ,
  ...props
  
}) {
    
  return (
    <Meter
        value={value}
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col gap-2", className))}
      {...props}>
     {({  percentage  }) => (
  <div className="flex w-full justify-between">
    <Label>{label}</Label>
    {showValue && (
      <span className={labelVariants()}>
        { value } cm
      </span>
    )}
  </div>
)}
    </Meter>
  );
}

export { Meter, JollyMeter }
