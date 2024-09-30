import React, { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const WhiteBoardComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);
  useEffect(() => {}, []);

  useEffect(() => {
    if (socket) {
      socket.on("canvasImage", (data) => {
        const image = new Image();
        image.src = data;
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          image.onload = () => {
            ctx.drawImage(image, 0, 0);
          };
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    let newSocket: Socket | null = null;
    try {
      newSocket = io("http://192.168.1.120:5000");
      console.log("connected to server ", newSocket);
      console.log("is socket null", newSocket == null);
      setSocket(newSocket);
    } catch (e) {
      console.log(e);
    }
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      if (e instanceof MouseEvent) {
        [lastX, lastY] = [e.offsetX, e.offsetY];
      } else {
        [lastX, lastY] = [e.touches[0].clientX, e.touches[0].clientY];
      }
    };

    const draw = (e: { offsetX: number; offsetY: number }) => {
      if (!isDrawing) return;
      console.log("drawing");
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      //const rect = canvas?.getBoundingClientRect();

      const rect = { left: 0, top: 0 };
      const ctx = canvas?.getContext("2d");

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX - rect.left, e.offsetY - rect.top);
        ctx.stroke();
      }
      [lastX, lastY] = [e.offsetX - rect.left, e.offsetY - rect.top];
    };

    const endDrawing = () => {
      if (!isDrawing) return;
      console.log("end drawing");

      const canvas = canvasRef.current;
      const dataUrl = canvas?.toDataURL();
      if (newSocket) {
        console.log("emitting data");
        newSocket.emit("canvasImage", dataUrl);
      }
      isDrawing = false;
    };

    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    canvas?.addEventListener("mousedown", startDrawing);
    canvas?.addEventListener("mousemove", draw);
    canvas?.addEventListener("mouseup", endDrawing);
    canvas?.addEventListener("mouseout", endDrawing);
  }, []);

  return (
    <canvas
      width="1300"
      height="900"
      id="whiteboard"
      className="whiteboard-canvas"
      ref={canvasRef}
    />
  );
};

export default WhiteBoardComponent;
