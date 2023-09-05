import express from "express";
import authApis from "./apis/auth.mjs";
import products from "./apis/products.mjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 5001;

const app = express();
app.use(cookieParser());
app.use(bodyParser());


app.use("/api/v1", authApis);
app.use("/api/v1", products);

app.listen(PORT , ()=>{
    console.log("listening on port: " + PORT);
})