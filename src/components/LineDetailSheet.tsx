import { useRouteStore } from "@/hooks/useRouteStore";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import TrafficInfos from "./TrafficInfos";
import LineLabel from "./LineLabel";
import { useEffect, useState } from "react";
import { getRelativeSecondsPast } from "@/lib/utils";
import Spinner from "./ui/spinner";

export default function LineDetailSheet() {
  const activeRoute = useRouteStore((state) => state.active);
  const setActiveRoute = useRouteStore((state) => state.setActive);
  const activeRouteData = useRouteStore((state) => state.data);
  const [lastUpdateSec, setLastUpdateSec] = useState<number | null>(null);

  useEffect(() => {
    const updateCounter = () => {
      setLastUpdateSec(
        getRelativeSecondsPast(new Date(activeRouteData!.lastUpdate))
      );
    };

    let timeout = null;
    if (activeRouteData) {
      updateCounter();
      timeout = setInterval(updateCounter, 1000);
    } else {
      setLastUpdateSec(null);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [activeRouteData]);

  return (
    <Drawer
      open={!!activeRoute}
      onOpenChange={(open) => {
        if (!open) setActiveRoute(null);
      }}
      modal={false}
    >
      {activeRoute && (
        <DrawerContent className="mx-2">
          <DrawerHeader>
            <DrawerTitle>
              <div className="flex items-center">
                <LineLabel route={activeRoute} />
                {lastUpdateSec != null && (
                  <p className="w-full text-right opacity-90 text-sm font-normal">
                    Last update {lastUpdateSec}s ago
                  </p>
                )}
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <div className="min-h-20">
            {activeRouteData ? <TrafficInfos /> : <Spinner />}
          </div>
          <p className="py-2 text-xs opacity-80 text-center">
            Please keep in mind that the locations may be inaccurate.
          </p>
        </DrawerContent>
      )}
    </Drawer>
  );
}
