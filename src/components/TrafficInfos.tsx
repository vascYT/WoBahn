import type { TrafficInfo } from "@/types/wiener_linien";
import { AlertCircle } from "lucide-react";

interface Props {
  trafficInfos: TrafficInfo[];
}
export default function TrafficInfos({ trafficInfos }: Props) {
  return (
    <div>
      {trafficInfos.map((trafficInfo) => (
        <button
          key={trafficInfo.name}
          className="flex items-center space-x-2 bg-orange-300 border border-orange-400 rounded-md py-3 px-2 mt-3 w-[240px] md:w-[320px] translate-x-[210px] md:translate-x-[285px] focus:translate-x-0 transition-transform"
        >
          <AlertCircle className="stroke-orange-700 w-8 shrink-0" />
          <div className="text-left">
            <h1 className="font-bold">{trafficInfo.title}</h1>
            <p className="text-sm">{trafficInfo.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
