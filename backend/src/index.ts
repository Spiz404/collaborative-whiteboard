import express, { Request, Response } from "express";
import { Server } from "socket.io";
import axios from "axios";

const io = new Server({ cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("canvasImage", (data: string | undefined) => {
    console.log("sending data");
    socket.broadcast.emit("canvasImage", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.listen(5000);
