import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";
import lines from "../lib/lines";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Fragment, useState } from "react";
import Logo from "../assets/wobahn.png";
import GithubIcon from "../assets/github.svg";
import { useLineStore } from "@/hooks/useLineStore";
import LineLabel from "./LineLabel";

const snapPoints = ["500px", 1];

export default function LineSheet() {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  const activeLineId = useLineStore((state) => state.id);
  const setActiveLineId = useLineStore((state) => state.setId);

  return (
    <Drawer
      defaultOpen
      modal={false}
      dismissible={false}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      open={!activeLineId}
    >
      <DrawerContent className="mx-2">
        <DrawerHeader>
          <DrawerTitle className="text-left">Select a line</DrawerTitle>
        </DrawerHeader>
        {Object.keys(lines).map((lineId) => (
          <Fragment key={lineId}>
            <Button
              className="justify-start my-1 active:opacity-80 active:scale-[99%] transition-all"
              variant="ghost"
              onClick={() => {
                setActiveLineId(lineId);
              }}
            >
              <LineLabel
                line={lines[lineId].lineLabel}
                direction={lines[lineId].directionLabel}
                color={lines[lineId].color}
              />
            </Button>
            <Separator />
          </Fragment>
        ))}
        <DrawerFooter className="mt-5">
          <div className="flex flex-col gap-3 items-center justify-center">
            <img src={Logo.src} alt="WoBahn Logo" className="w-28" />
            <div className="flex flex-row items-center justify-center gap-2 opacity-70">
              <a href="/about" className="text-sm">
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
      </DrawerContent>
    </Drawer>
  );
}
