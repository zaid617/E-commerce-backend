import { db } from "../db/dbConnect.mjs";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();


  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  /////////////     USER API'S         //////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////
  ////////////////add products to cart///////////////////////
  ///////////////////////////////////////////////////////////

  router.post("/cart", async (req, res) => {
    let {
      productName,
      productPrice,
      productCompany,
      productCategory,
      productDescription,
      productPhotoUrl,
      productUnit,
      userName,
      email,
      productGender,
      userId,
    } = req.body;

    console.log("productName :", productName)
    console.log("productPrice :", productPrice)
    console.log("productCompany :", productCompany)
    console.log("productCategory :", productCategory)
    console.log("productDescription :", productDescription)
    console.log("productPhotoUrl :", productPhotoUrl)
    console.log("productUnit :", productUnit)
    console.log("userName :", userName)
    console.log("email :", email)
    console.log("productGender :", productGender)
    console.log("userId :", userId);

    if (
      !productName ||
      !userId ||
      !productPrice ||
      !productUnit ||
      !productCompany ||
      !productCategory ||
      !productDescription ||
      !productPhotoUrl ||
      !userName ||
      !email ||
      !productGender
    ) {
      res.status(402).send({
        message: "Please enter complete information",
        data: {
          productName: "new productName",
          productPrice: "new productPrice",
          productCompany: "new productCompany",
          productCategory: "new productCategory",
          productDescription: "new productDescription",
          productPhotoUrl: "new productPhotoUrl",
          productUnit: "productUnit",
          userName: "userName",
          email: "email",
          productGender: "gender",
          userId: "userId",
        },
      });

      return;
    } else {
      let productAdd = await db.collection(userId).insertOne({
        productPrice: productPrice,
        productCompany: productCompany,
        productCategory: productCategory,
        productDescription: productDescription,
        productPhotoUrl: productPhotoUrl,
        productGender: productGender,
        productName: productName,
        userName: userName,
        productUnit: productUnit,
        email: email,
        userId: userId,
        isDelivered: false,
        addedDate: new Date().getTime(),
        isDeleted: false,
      });

      const response = db.collection(userId).find({ isDeleted: false });
      let results = await response.toArray();
      res
        .status(200)
        .send({ message: "product added to cart successfully", data: results });
      return;
    }

    res.status(500).send("product not added server error");
  });



////////////////////////////////////////////////////////////
////////// getting cart products       /////////////////////
////////////////////////////////////////////////////////////

router.get("/cart/:userId", async (req, res) => {

  let userId = req.params.userId;
  console.log(userId);

  const response = db.collection(userId).find({isDeleted: false});

  try {
    let results = await response.toArray();
    res
      .status(200)
      .send({
        data: results,
        message: "getting all cart products successfully",
      });
  } catch (err) {
    res.status(501).send({ message: "error in sending products from server" });
  }
});

////////////////////////////////////////////////////////////
//////////////////////// editing product///////////////////
////////////////////////////////////////////////////////////

router.put("/cart/:id", async (req, res) => {
  let id = req.params.id;

  let { productUnit, userId } = req.body;

  try {
    if (id) {
      const updateResponse = await db.collection(userId).updateOne(
        { _id: new ObjectId(id) },
        {
          $set: { productUnit: productUnit },
        }
      );
      const response = db.collection(userId).find({ userId: userId });
      let results = await response.toArray();

      res.send({ message: "product edit successfully", data: results });
    } else {
      res.send({ message: "no product found with this id" });
    }
  } catch (error) {
    res.send({ message: "error from server in editing product" });
  }
});

////////////////////////////////////////////////////////////
//////////////////////// deleting cart product  ////////////
////////////////////////////////////////////////////////////

router.delete("/cart/:userId/:id", async (req, res) => {
  let id = req.params.id;
  let userId = req.params.userId;

  console.log("id :" , id);
  console.log("userId :" , userId);

  try {
    if (id) {
      const deleteResponse = await db.collection(userId).deleteOne({
        _id: new ObjectId(id),
      });
      const response = db.collection(userId).find({ isDeleted: false });
      let results = await response.toArray();

      res.send({
        message: "product deleted to cart successfully",
        data: results,
      });
    } else {
      res.send({ message: "no product found with this id" });
    }
  } catch (error) {
    res.send({ message: "error from server in deleting product" });
  }
});

export default router;
