import { LoaderCircle } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle className="size-4 animate-spin opacity-80" />
    </div>
  );
}
