'use client';
import { Canvas } from "@/components/Canvas";
import { useEffect ,useState } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { Config } from "@/config";

export default function HomePage() {
  const params = useParams();
  const roomId = params.roomId as string; 
  
  return (
    <div>
        <Canvas roomId={roomId}></Canvas>
    </div>
  );
}