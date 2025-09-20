import { useState, useEffect, useRef } from "react";

type canvasRefType = React.RefObject<HTMLCanvasElement>;

const useCanvasZoom = (canvasRef: canvasRefType) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const startPan = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (event: WheelEvent) => {
      // Prevent default scrolling
      event.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      const oldZoom = zoomLevel;
      let newZoom = oldZoom;

      if (event.ctrlKey) {
        // Trackpad pinch gesture
        newZoom = oldZoom * (1 - event.deltaY * 0.01);
      } else {
        // Normal mouse wheel
        newZoom = event.deltaY > 0 ? oldZoom * 0.9 : oldZoom * 1.1;
      }

      const clampedZoom = Math.max(0.1, Math.min(5, newZoom));

      // Adjust pan to keep zoom centered on cursor
      const newPanX = mouseX - (mouseX - panPosition.x) * (clampedZoom / oldZoom);
      const newPanY = mouseY - (mouseY - panPosition.y) * (clampedZoom / oldZoom);

      setZoomLevel(clampedZoom);
      setPanPosition({ x: newPanX, y: newPanY });
    };

    const handleMouseDown = (event: MouseEvent) => {
      isPanning.current = true;
      startPan.current = {
        x: event.clientX - panPosition.x,
        y: event.clientY - panPosition.y,
      };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isPanning.current) return;
      setPanPosition({
        x: event.clientX - startPan.current.x,
        y: event.clientY - startPan.current.y,
      });
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    const getDistance = (touches: Touch[]) =>
      Math.sqrt(
        Math.pow(touches[0].clientX - touches[1].clientX, 2) +
          Math.pow(touches[0].clientY - touches[1].clientY, 2)
      );

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        lastTouchDistance.current = getDistance(event.touches);
        event.preventDefault();
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const newDistance = getDistance(event.touches);
        const delta = newDistance - (lastTouchDistance.current ?? newDistance);

        const oldZoom = zoomLevel;
        const newZoom = oldZoom * (1 + delta * 0.005);
        const clampedZoom = Math.max(0.1, Math.min(5, newZoom));

        const rect = canvas.getBoundingClientRect();
        const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
        const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
        const mouseX = centerX - rect.left;
        const mouseY = centerY - rect.top;

        const newPanX = mouseX - (mouseX - panPosition.x) * (clampedZoom / oldZoom);
        const newPanY = mouseY - (mouseY - panPosition.y) * (clampedZoom / oldZoom);

        setZoomLevel(clampedZoom);
        setPanPosition({ x: newPanX, y: newPanY });
        lastTouchDistance.current = newDistance;
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      lastTouchDistance.current = null;
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [zoomLevel, panPosition, canvasRef]);

  return { zoomLevel, panPosition };
};

export default useCanvasZoom;
