import express, { Request, Response } from "express";
import axios from "axios";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
