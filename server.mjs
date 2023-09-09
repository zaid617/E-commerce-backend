import express from "express";
import authApis from "./apis/auth.mjs";
import products from "./apis/products.mjs";
import cart from "./apis/cart.mjs";
import order from "./apis/order.mjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

const PORT = process.env.PORT || 5001;

const app = express();

const corsOptions = {
  origin: ["https://dnk-shop.netlify.app", "http://localhost:3000"], // Replace with your allowed origin(s)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // No content response for preflight requests
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser());

app.use("/api/v1", authApis);
app.use("/api/v1", products);
app.use("/api/v1", cart);
app.use("/api/v1", order);

const __dirname = path.resolve();

app.use("/", express.static(path.join(__dirname, "./build")));
app.use("*", express.static(path.join(__dirname, "./build")));


app.listen(PORT, () => {
  console.log("listening on port: " + PORT);
});
