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


const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser())
app.use(express.json());
app.use(cookieParser());

app.use(cors({


  origin: [
    "https://dnk-shop.netlify.app",
    "http://localhost:3000",
    "*"
  ]
  ,

    credentials: true,

})
);


app.use("/api/v1", authApis);


app.use("/api/v1", (req, res, next) => {

  if (!req?.cookies?.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }
  
  jwt.verify(req.cookies.Token, SECRET, (err, decodedData) => {
    if (!err) {

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401).send({ message: "token expired" });
        res.cookie("Token", " ", {
          maxAge: 1,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      } else {
        console.log("token approved");

        req.body.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});


app.use("/api/v1", products);
app.use("/api/v1", cart);
app.use("/api/v1", order);


const __dirname = path.resolve();

app.use("/", express.static(path.join(__dirname, "./build")));
app.use("*", express.static(path.join(__dirname, "./build")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})