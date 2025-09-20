"use client"
import React, { useState } from "react"
import Topbar from "./TopBar";
import { useDraw } from "../hooks/useDraw"; // Import the custom hook

// The tool type might be defined in the hook, but we need it here too
type Tool = "pencil" | "rect" | "circle" | "arrow";

// --- Main Canvas Component ---
export const Canvas = ({ roomId }: { roomId: string }) => {
  const [color, setColor] = useState<string>("#ffffff");
  const [eraserOn, setEraserOn] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");

  // The hook handles all the complex logic
  const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, clear } = useDraw({
    roomId,
    color,
    eraserOn,
    selectedTool,
  });

  return (
    <div className="w-screen h-screen bg-black">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="bg-[#0A0A0A]"
      />
      <Topbar
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
        color={color}
        setColor={setColor}
        eraserOn={eraserOn}
        setEraserOn={setEraserOn}
        clear={clear}
      />
    </div>
  );
}