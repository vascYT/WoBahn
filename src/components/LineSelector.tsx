import { AlertCircle } from "lucide-react";
import { useLineStore } from "../hooks/useLineStore";
import type { TrafficInfo } from "../types/wiener_linien";
import lines from "../utils/lines";

interface Props {
  trafficInfos: TrafficInfo[];
}
export default function LineSelector({ trafficInfos }: Props) {
  const lineId = useLineStore((state) => state.id);
  const setLineId = useLineStore((state) => state.setId);

  return (
    <div className="absolute top-0 right-0 z-[600] overflow-hidden p-1 text-right">
      <select
        className="px-5 py-2 rounded-md border border-black text-base"
        value={lineId}
        onChange={(e) => setLineId(e.target.value)}
      >
        {Object.keys(lines).map((id) => (
          <option key={id} value={id}>
            {lines[id].name}
          </option>
        ))}
      </select>
      {trafficInfos.map((trafficInfo) => (
        <button
          key={trafficInfo.name}
          className="flex items-center space-x-2 bg-orange-300 border border-orange-400 rounded-md py-1 px-2 mt-3 w-[240px] md:w-[320px] translate-x-[210px] md:translate-x-[285px] focus:translate-x-0 transition-transform"
        >
          <AlertCircle className="stroke-orange-700 w-16" />
          <div className="text-left">
            <h1 className="font-bold">{trafficInfo.title}</h1>
            <p className="text-sm">{trafficInfo.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
