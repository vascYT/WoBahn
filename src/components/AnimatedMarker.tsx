import { useImperativeHandle, useRef, useState, type RefObject } from "react";
import { Marker, Popup, type MarkerProps } from "react-map-gl/maplibre";

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export interface AnimatedMarkerRef {
  moveTo: (pos: { lat: number; lng: number }, duration: number) => void;
  isMoving: () => boolean;
}

export default function AnimatedMarker({
  ref,
  ...props
}: {
  ref?: RefObject<AnimatedMarkerRef | null>;
  popupContent?: React.ReactNode;
  children: React.ReactNode;
  initialLat: number;
  initialLng: number;
}) {
  const [position, setPosition] = useState({
    lat: props.initialLat,
    lng: props.initialLng,
  });
  const [isPopupShowing, setIsPopupShowing] = useState(false);
  const isMoving = useRef<boolean>(false);
  const genRef = useRef(0);

  const moveMarker = (
    newPos: { lat: number; lng: number },
    duration: number
  ) => {
    isMoving.current = true;
    const myGen = ++genRef.current;
    const start = position;
    const startTime = performance.now();

    const animate = (time: number) => {
      if (genRef.current !== myGen) return;

      const t = Math.min((time - startTime) / duration, 1);
      const tE = easeInOutCubic(t);
      const lat = start.lat + (newPos.lat - start.lat) * tE;
      const lng = start.lng + (newPos.lng - start.lng) * tE;

      setPosition({ lat, lng });

      if (t < 1) requestAnimationFrame(animate);
      else isMoving.current = false;
    };

    requestAnimationFrame(animate);
  };

  useImperativeHandle(ref, () => ({
    moveTo: moveMarker,
    isMoving() {
      return isMoving.current;
    },
  }));

  return (
    <>
      <Marker
        latitude={position.lat}
        longitude={position.lng}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setIsPopupShowing(true);
        }}
      >
        {props.children}
      </Marker>
      {isPopupShowing && props.popupContent && (
        <Popup
          latitude={position.lat}
          longitude={position.lng}
          onClose={() => setIsPopupShowing(false)}
        >
          {props.popupContent}
        </Popup>
      )}
    </>
  );
}
