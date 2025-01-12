import { useLineStore } from "../hooks/useLineStore";
import lines from "../utils/lines";

export default function LineSelector() {
  const lineId = useLineStore((state) => state.id);
  const setLineId = useLineStore((state) => state.setId);

  return (
    <select
      className="absolute top-1 right-1 z-[1000] px-5 py-2 rounded-md border border-black"
      value={lineId}
      onChange={(e) => setLineId(e.target.value)}
    >
      {Object.keys(lines).map((id) => (
        <option key={id} value={id}>
          {lines[id].name}
        </option>
      ))}
    </select>
  );
}
