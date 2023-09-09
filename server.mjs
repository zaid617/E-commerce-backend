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
app.use(cookieParser());
app.use(bodyParser());

app.use(cors({
  origin: ["https://dnk-shop.netlify.app", "http://localhost:3000","*"]
  ,
    credentials: true,
})
);


app.use("/api/v1", authApis);

// middleware will be added here //

app.use("/api/v1", products);
app.use("/api/v1", cart);
app.use("/api/v1", order);

const __dirname = path.resolve();

app.use("/", express.static(path.join(__dirname, "./build")));
app.use("*", express.static(path.join(__dirname, "./build")));


app.listen(PORT, () => {
  console.log("listening on port: " + PORT);
});
