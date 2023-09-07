import express from "express";
import authApis from "./apis/auth.mjs";
import products from "./apis/products.mjs";
import cart from "./apis/cart.mjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

const PORT = process.env.PORT || 5001;

const app = express();
app.use(cookieParser());
app.use(bodyParser());

app.use(cors( {
   origin: [
  "https://dnk-shop.netlify.app",
  "http://localhost:3000",
  "*"
],
  methods: "GET,PUT,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}));

app.use("/api/v1", authApis);
app.use("/api/v1", products);
app.use("/api/v1", cart);

app.listen(PORT, () => {
  console.log("listening on port: " + PORT);
});
