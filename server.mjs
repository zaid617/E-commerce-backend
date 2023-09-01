import express from "express";
import authApis from "./apis/auth.mjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/", (req, res)=>{
    res.status(200).send("hello world!");
})

app.listen(PORT , ()=>{
    console.log("listening on port: " + PORT);
})