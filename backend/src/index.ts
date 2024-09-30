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

let port = 3000;
if (process.env.SERVER_PORT) port = parseInt(process.env.SERVER_PORT);

io.listen(port);
