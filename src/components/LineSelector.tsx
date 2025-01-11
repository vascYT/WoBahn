import { useLineStore } from "../hooks/useLineStore";
import stopIds from "../utils/stop-ids";

export default function LineSelector() {
  const lineId = useLineStore((state) => state.id);
  const setLineId = useLineStore((state) => state.setId);

  return (
    <select
      className="absolute top-1 right-1 z-[1000] px-5 py-2 rounded-md border border-black"
      value={lineId}
      onChange={(e) => setLineId(e.target.value)}
    >
      {Object.keys(stopIds).map((id) => (
        <option value={id}>{id}</option>
      ))}
    </select>
  );
}
