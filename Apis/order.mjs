import { db } from "../db/dbConnect.mjs";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();
const ORDERS = db.collection("ORDERS");

////////////////////add new order/////////////////////

router.post("/order/:userId", async (req, res) => {
  let { email, address, products } = req.body;
  let id = req.params.userId;

  if ((!email, !address, !products)) {
    res.status(402).send({
      message: "Please send complete information",
      data: {
        address: "your address",
        Email: "abc@abc.com",
      },
    });
  } else {

    let addOrder = await ORDERS.insertOne({
      products: [products],
      email: email,
      address: address,
      isDelivered: false,
      userId: id,

    });

    try {
      if (addOrder) {
        res.status(200).send("Successfully ordered");
      }
    } catch (error) {
      res.status(402).send("error in order");
    }
}
        
});

////////////////////////////////////////////////////////
////////////////getting all user orders/////////////////
////////////////////////////////////////////////////////

router.get("/order/:userId", async (req, res) => {
    let userId = req.params.userId;
  
    const response = ORDERS.find({ "userId": userId });
  
    try {
      let results = await response.toArray();
      res.status(200).send({
        data: results,
        message: "getting all cart products successfully",
      });
    } catch (err) {
      res.status(501).send({ message: "error in sending products from server" });
    }
  });
  

export default router;
