import { JollyMeter } from "@/components/ui/meter"

export function DistanceSlider({value}) {
 
  return <JollyMeter className="w-3/5" label="Detection Distance" value={value}   minValue={0}
  maxValue={800} />
}

