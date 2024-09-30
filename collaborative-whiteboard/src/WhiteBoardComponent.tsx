import React, { useRef, useEffect } from "react";

const WhiteBoardComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      const canvas = canvasRef.current;
      console.log("start drawing");
      isDrawing = true;
      //const rect = canvas?.getBoundingClientRect();
      const rect = { left: 0, top: 0 };
      [lastX, lastY] = [e.offsetX - rect.left, e.offsetY - rect.top];
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
      console.log("end drawing");
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
