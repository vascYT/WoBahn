export default function LineLabel({
  line,
  direction,
  color,
}: {
  line: string;
  direction: string;
  color: string;
}) {
  return (
    <p className="flex items-center gap-2">
      <span
        className="flex items-center justify-center w-10 h-6 rounded-xs font-semibold"
        style={{ backgroundColor: `${color}90` }}
      >
        {line}
      </span>
      {direction}
    </p>
  );
}
