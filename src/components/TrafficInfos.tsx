import { useLineStore } from "@/hooks/useLineStore";
import { AlertCircle } from "lucide-react";

export default function TrafficInfos() {
  const activeLineData = useLineStore((state) => state.data);

  if (!activeLineData) return <></>;

  if (activeLineData.trafficInfos.length == 0)
    return <p className="text-sm opacity-90 text-center">No current issues.</p>;

  return (
    <div className="pb-5 px-4">
      {activeLineData.trafficInfos.map((trafficInfo) => (
        <button
          key={trafficInfo.name}
          className="flex items-center space-x-2 bg-orange-300 border border-orange-400 rounded-md py-3 px-2 mt-3 w-full"
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
