import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import lines from "@/assets/lines.json";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Fragment, useState } from "react";
import Logo from "../assets/wobahn.png";
import GithubIcon from "../assets/github.svg";
import { useRouteStore } from "@/hooks/useRouteStore";
import LineLabel from "./LineLabel";
import Route from "@/lib/route";
import type { LineType } from "@/types/api";
import Beta from "./ui/beta";
import { track } from "@plausible-analytics/tracker";

function RouteButtons({
  type,
  setActiveRoute,
}: {
  type: LineType;
  setActiveRoute: (route: Route) => void;
}) {
  return Object.keys(lines)
    .filter((lineId) => lines[lineId as keyof typeof lines].type === type)
    .map((lineId) =>
      ["H", "R"].map((direction) => {
        const route = new Route(lineId, direction as "H" | "R");

        return (
          <Fragment key={route.toString()}>
            <Button
              className="justify-start py-6 active:opacity-80 active:scale-[99%] transition-all w-full"
              variant="ghost"
              onClick={() => {
                track("route_select", {
                  props: { line: route.toString() },
                });
                setActiveRoute(route);
              }}
            >
              <LineLabel route={route} />
            </Button>
            <Separator />
          </Fragment>
        );
      }),
    );
}

const snapPoints = ["300px", 1];

export default function LineSheet() {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const activeRoute = useRouteStore((state) => state.active);
  const setActiveRoute = useRouteStore((state) => state.setActive);

  return (
    <Drawer
      defaultOpen
      modal={false}
      dismissible={false}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      open={!activeRoute}
    >
      <DrawerContent className="h-[95%]">
        <DrawerHeader>
          <DrawerTitle className="text-left">Select a line</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-scroll">
          {(
            [
              { type: "ptMetro", text: "Metros" },
              { type: "ptTram", text: "Trams" },
              { type: "ptBusCity", text: "Buses" },
              { type: "ptBusNight", text: "Night Buses" },
            ] as { type: LineType; text: string }[]
          ).map((i) => (
            <div key={i.type} className="mb-5">
              <div className="flex items-center gap-2 px-4">
                <p className="font-bold text-lg">{i.text}</p>
                {i.type !== "ptMetro" && <Beta />}
              </div>
              <RouteButtons type={i.type} setActiveRoute={setActiveRoute} />
            </div>
          ))}
          <DrawerFooter className="mt-5">
            <div className="flex flex-col gap-3 items-center justify-center">
              <img src={Logo.src} alt="WoBahn Logo" className="w-28" />
              <div className="flex flex-row items-center justify-center gap-2 opacity-70">
                <a href="https://vasc.dev/posts/wobahn" className="text-sm">
                  About
                </a>
                <span>&bull;</span>
                <p className="text-sm">v{__APP_VERSION__}</p>
                <span>&bull;</span>
                <a href="https://github.com/vascYT/WoBahn" target="_blank">
                  <img
                    src={GithubIcon.src}
                    alt="Github icon"
                    className="fill-black size-5"
                  />
                </a>
              </div>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
