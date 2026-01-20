import type Route from "@/lib/route";

export default function LineLabel({ route }: { route: Route }) {
  const line = route.getLine();
  const direction = route.getDirection();

  return (
    <p className="flex items-center gap-2">
      <span
        className="flex items-center justify-center w-10 h-6 rounded-xs font-semibold"
        style={{ backgroundColor: `${route.getColor()}90` }}
      >
        {line.lineLabel}
      </span>
      {direction.directionLabel}
      {line.type !== "ptMetro" && (
        <span className="flex items-center justify-center w-8 h-4 rounded-xs font-semibold bg-linear-to-r from-orange-500 to-yellow-500 text-white text-xs">
          Beta
        </span>
      )}
    </p>
  );
}
