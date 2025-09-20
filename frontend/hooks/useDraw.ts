"use client"
import { useEffect, useRef, useState, MouseEvent } from "react";
import { io, Socket } from "socket.io-client";
import { Config } from "@/config";
import { drawLine, drawArrow, drawEmptyEllipse, drawEmptyRectangle } from "../utils/drawItems";

// Define the types for our hook's parameters and drawing data
type Point = { x: number; y: number };
type Tool = "pencil" | "rect" | "circle" | "arrow";

type UseDrawProps = {
    roomId: string;
    color: string;
    eraserOn: boolean;
    selectedTool: Tool;
};

type DrawData = {
    prevPoint: Point | null;
    currentPoint: Point;
    color: string;
    size: number;
    tool: Tool;
};

// --- The Custom Hook ---
export const useDraw = ({ roomId, color, eraserOn, selectedTool }: UseDrawProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const startPoint = useRef<Point | null>(null);
    const canvasSnapshot = useRef<ImageData | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    // --- Socket Connection and Event Listeners ---
    useEffect(() => {
        const newSocket = io(Config.URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket server with ID:', newSocket.id);
            if (roomId) {
                newSocket.emit('join-room', roomId);
            }
        });


        newSocket.on('canvas-state', (history: DrawData[]) => {
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) {
                // Loop through all previous drawing commands and redraw them instantly
                history.forEach((data) => {
                    const { prevPoint, currentPoint, color, size, tool } = data;
                    const drawProps = { prevPoint, currentPoint, ctx, color, size };
                    switch (tool) {
                        case "pencil": drawLine(drawProps); break;
                        case "rect": drawEmptyRectangle(drawProps); break;
                        case "circle": drawEmptyEllipse(drawProps); break;
                        case "arrow": drawArrow(drawProps); break;
                    }
                });
            }
        });
        
        // Listen for drawing data from other users
        newSocket.on('draw-data', (data: DrawData) => {
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) {
                const { prevPoint, currentPoint, color, size, tool } = data;
                const drawProps = { prevPoint, currentPoint, ctx, color, size };
                switch (tool) {
                    case "pencil":
                        drawLine(drawProps);
                        break;
                    case "rect":
                        drawEmptyRectangle(drawProps);
                        break;
                    case "circle":
                        drawEmptyEllipse(drawProps);
                        break;
                    case "arrow":
                        drawArrow(drawProps);
                        break;
                }
            }
        });

        // Listen for canvas clear events from other users
        newSocket.on('clear-canvas', () => {
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);
    
    // --- Canvas Setup ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          };
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);
          return () => window.removeEventListener('resize', resizeCanvas);
        }
      }, []);

    // --- Helper Functions ---
    const getCanvasContext = () => canvasRef.current?.getContext("2d") || null;

    const getMousePosition = (event: MouseEvent<HTMLCanvasElement>): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    // --- Event Handlers (Emitting Data) ---
    const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        const ctx = getCanvasContext();
        const currentPoint = getMousePosition(event);
        if (!ctx || !currentPoint) return;

        isDrawing.current = true;
        startPoint.current = currentPoint;

        if (selectedTool !== 'pencil') {
            canvasSnapshot.current = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    };

    const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current) return;
        const ctx = getCanvasContext();
        const currentPoint = getMousePosition(event);
        if (!ctx || !currentPoint || !startPoint.current) return;

        const drawColor = eraserOn ? '#0A0A0A' : color;
        const lineSize = eraserOn ? 10 : 5;
        const tool = eraserOn ? 'pencil' : selectedTool; // Eraser is just a big pencil

        if (tool === 'pencil') {
            const drawData: DrawData = { prevPoint: startPoint.current, currentPoint, color: drawColor, size: lineSize, tool };
            drawLine({ ...drawData, ctx });
            socket?.emit('draw-data', { ...drawData, roomId });
            startPoint.current = currentPoint;
        } else {
            if (canvasSnapshot.current) {
                ctx.putImageData(canvasSnapshot.current, 0, 0);
            }
            // This is for local preview only, we'll emit the final shape on mouse up
            const drawProps = { prevPoint: startPoint.current, currentPoint, ctx, color: drawColor, size: lineSize };
            switch(tool) {
                case "rect": drawEmptyRectangle(drawProps); break;
                case "circle": drawEmptyEllipse(drawProps); break;
                case "arrow": drawArrow(drawProps); break;
            }
        }
    };

    const handleMouseUp = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing.current || !startPoint.current) return;
        const ctx = getCanvasContext();
        const currentPoint = getMousePosition(event);
        if (!ctx || !currentPoint) return;

        const drawColor = eraserOn ? '#0A0A0A' : color;
        const lineSize = eraserOn ? 10 : 5;
        
        // For shapes, we emit the final drawing data on mouse up
        if (selectedTool !== 'pencil' && !eraserOn) {
            const drawData: DrawData = { prevPoint: startPoint.current, currentPoint, color: drawColor, size: lineSize, tool: selectedTool };
            socket?.emit('draw-data', { ...drawData, roomId });
        }

        isDrawing.current = false;
        startPoint.current = null;
        canvasSnapshot.current = null;
    };

    const handleMouseLeave = (event: MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing.current) {
            handleMouseUp(event);
        }
    };

    const clear = () => {
        const ctx = getCanvasContext();
        if (!ctx) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        socket?.emit('clear-canvas', { roomId });
    };

    return { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave, clear };
};