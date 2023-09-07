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

const corsOpts = {
  origin: [
    "https://dnk-shop.netlify.app",
    "https://dnk-shop.netlify.app/api/v1",
    "https://ecommerce0001.cyclic.cloud",
    "https://ecommerce0001.cyclic.cloud/api/v1",
    "http://localhost:3000",
    "http://localhost:3000/api/v1",
    "*",
  ],

  methods: [
    'GET',
    'POST',
    'DELETE',
    'PUT'
  ],

  allowedHeaders: [
    'Content-Type',
  ],
  credentials: true,
};

app.use(cors(corsOpts));

app.use("/api/v1", authApis);
app.use("/api/v1", products);
app.use("/api/v1", cart);

app.listen(PORT, () => {
  console.log("listening on port: " + PORT);
});
