import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useLineStore } from "../hooks/useLineStore";
import lines from "../lib/lines";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function LineLabel({
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

export default function LineSelector() {
  const [open, setOpen] = useState(false);
  const lineId = useLineStore((state) => state.id);
  const setLineId = useLineStore((state) => state.setId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-[240px] h-10"
        >
          <LineLabel
            line={lines[lineId].lineLabel}
            direction={lines[lineId].directionLabel}
            color={lines[lineId].color}
          />
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 z-[600] w-[240px]">
        <Command>
          <CommandInput placeholder="Search line..." />
          <CommandList>
            <CommandEmpty>No line found.</CommandEmpty>
            <CommandGroup>
              {Object.keys(lines).map((_lineId) => (
                <CommandItem
                  key={_lineId}
                  value={_lineId}
                  onSelect={(currentValue) => {
                    setLineId(currentValue);
                    setOpen(false);
                  }}
                >
                  <LineLabel
                    line={lines[_lineId].lineLabel}
                    direction={lines[_lineId].directionLabel}
                    color={lines[_lineId].color}
                  />
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 ml-auto",
                      lineId === _lineId ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
