import React, { useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const WhiteBoardComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = React.useState<Socket | null>(null);

  const [canvasSize, setCanvasSize] = React.useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (socket) {
      socket.on("canvasImage", (data) => {
        const image = new Image();
        image.src = data;
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        let ctx: CanvasRenderingContext2D | null = null;
        if (canvas) ctx = canvas?.getContext("2d");
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
        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
        [lastX, lastY] = [
          e.touches[0].clientX - rect.left,
          e.touches[0].clientY - rect.top,
        ];
      }
    };

    //const draw = (e: { offsetX: number; offsetY: number }) => {
    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (e instanceof TouchEvent) console.log("TOUCH EVENT");
      if (!isDrawing) return;
      console.log("drawing");
      const canvas: HTMLCanvasElement | null = canvasRef.current;

      const ctx = canvas?.getContext("2d");
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const newPosition =
        e instanceof MouseEvent
          ? { posx: e.offsetX, posy: e.offsetY }
          : {
              posx: e.touches[0].clientX - rect.left,
              posy: e.touches[0].clientY - rect.top,
            };

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(newPosition.posx, newPosition.posy);
        ctx.stroke();
      }
      [lastX, lastY] = [newPosition.posx, newPosition.posy];
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

    const resize = () => {
      console.log("resizing");
    };
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas) {
      const boundingRect = canvas.getBoundingClientRect();
      console.log(boundingRect);
      const { width, height } = boundingRect;
      setCanvasSize({ width, height });
      canvas.height = height;
      canvas.width = width;
    }
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    canvas?.addEventListener("resize", resize);
    canvas?.addEventListener("touchstart", startDrawing);
    canvas?.addEventListener("touchmove", draw);
    canvas?.addEventListener("mousedown", startDrawing);
    canvas?.addEventListener("touchend", endDrawing);
    canvas?.addEventListener("mousemove", draw);
    canvas?.addEventListener("mouseup", endDrawing);
    canvas?.addEventListener("mouseout", endDrawing);

    return () => {
      canvas?.removeEventListener("resize", resize);
      canvas?.removeEventListener("mousedown", startDrawing);
      canvas?.removeEventListener("mousemove", draw);
      canvas?.removeEventListener("mouseup", endDrawing);
      canvas?.removeEventListener("mouseout", endDrawing);
      canvas?.removeEventListener("touchstart", startDrawing);
      canvas?.removeEventListener("touchmove", draw);
      canvas?.removeEventListener("touchend", endDrawing);
    };
  }, []);

  return (
    <canvas
      width="1000"
      height="700"
      id="whiteboard"
      className="whiteboard-canvas"
      ref={canvasRef}
    />
  );
};

export default WhiteBoardComponent;
