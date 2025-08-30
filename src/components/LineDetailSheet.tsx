import { useLineStore } from "@/hooks/useLineStore";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import TrafficInfos from "./TrafficInfos";
import LineLabel from "./LineLabel";
import lines from "@/lib/lines";
import { useEffect, useState } from "react";
import { getRelativeSecondsPast } from "@/lib/utils";
import Spinner from "./ui/spinner";

export default function LineDetailSheet() {
  const activeLineId = useLineStore((state) => state.id);
  const setActiveLineId = useLineStore((state) => state.setId);
  const activeLineData = useLineStore((state) => state.data);
  const [lastUpdateSec, setLastUpdateSec] = useState<number | null>(null);

  useEffect(() => {
    const updateCounter = () => {
      setLastUpdateSec(
        getRelativeSecondsPast(new Date(activeLineData!.lastUpdate))
      );
    };

    let timeout = null;
    if (activeLineData) {
      updateCounter();
      timeout = setInterval(updateCounter, 1000);
    } else {
      setLastUpdateSec(null);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [activeLineData]);

  return (
    <Drawer
      open={!!activeLineId}
      onOpenChange={(open) => {
        if (!open) setActiveLineId(null);
      }}
      modal={false}
    >
      {activeLineId && (
        <DrawerContent className="mx-2">
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex items-center">
                <LineLabel
                  line={lines[activeLineId].lineLabel}
                  direction={lines[activeLineId].directionLabel}
                  color={lines[activeLineId].color}
                />
                {lastUpdateSec != null && (
                  <p className="text-sm font-normal opacity-90 w-full text-right">
                    Last update {lastUpdateSec}s ago
                  </p>
                )}
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-20">
            {activeLineData ? <TrafficInfos /> : <Spinner />}
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
}
