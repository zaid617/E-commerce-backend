import express from "express";
import authApis from "./apis/auth.mjs";
import products from "./apis/products.mjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

const PORT = process.env.PORT || 5001;

const app = express();
app.use(cookieParser());
app.use(bodyParser());
app.use(
  cors({
    origin: [
      "https://final-hackathon-c1283.web.app",
      "http://localhost:3000",
      "http://localhost:3000/api/v1",
      "*",
    ],
    credentials: true,
  })
);

app.use("/api/v1", authApis);
app.use("/api/v1", products);

app.listen(PORT, () => {
  console.log("listening on port: " + PORT);
});
