import express from "express";

const PORT = process.env.PORT || 5001;
const app = express();

app.use("/", (req, res)=>{
    res.status(200).send("hello world!");
})

app.listen(PORT , ()=>{
    console.log("listening on port: " + PORT);
})