"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis ,LabelList  } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
   ChartConfig,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

// const chartData = [
//   { Gate: "Gate 0", value: 186, threshold: 80 },
//   { Gate: "Gate 1", value: 305, threshold: 200 },
//   { Gate: "Gate 2", value: 237, threshold: 120 },
//   { Gate: "Gate 3", value: 73, threshold: 190 },
//   { Gate: "Gate 4", value: 209, threshold: 130 },
//   { Gate: "Gate 5", value: 214, threshold: 140 },
//   { Gate: "Gate 6", value: 214, threshold: 140 },
//   { Gate: "Gate 7", value: 214, threshold: 140 },
// ]

const chartConfig = {
  value: {
    label: "Signal Value",
    color: "var(--chart-1)",
  },
  threshold: {
    label: "Sensitivity Threshold",
    color: "var(--chart-2)",
  },
}

export function ConfigureMotionChart({chartData}) {
  return (
    <Card >
      <CardHeader>
        <CardTitle>Motion Data.</CardTitle>
        
      </CardHeader>
      <CardContent >
        <ChartContainer className="h-[250px] w-[450px]" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Gate"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar max={120} dataKey="value" fill="var(--color-value)" radius={4} >
            <LabelList
  dataKey="value"
  position="top"
  formatter={(value) => `${value}`}
/>
</Bar>
            <Bar max={120} dataKey="threshold" fill="var(--color-threshold)" radius={4} >
               <LabelList
  dataKey="threshold"
  position="top"
  formatter={(value) => `${value}`}
/>
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
     
    </Card>
  )
}
