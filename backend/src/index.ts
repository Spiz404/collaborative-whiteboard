import express, { Request, Response } from "express";
import { Server } from "socket.io";
import axios from "axios";

const io = new Server();

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

io.listen(5000);
