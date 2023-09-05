import { db } from "../db/dbConnect.mjs";
import express from "express";
import { ObjectId } from 'mongodb';

const router = express.Router();
const PRODUCTS = db.collection("PRODUCTS");




///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////     ADMIN APIS         //////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////
////////////////add products///////////////////////////////
///////////////////////////////////////////////////////////

router.post("/product", async (req, res) => {

  let { 
      productName
    , productPrice
    , productQuantity
    , productCompany
    , productCategory
    , productDescription
    , productGender
    , productPhotoUrl } = req.body
  
    if (!productName || !productPrice || !productQuantity || !productCompany || !productCategory || !productDescription || !productPhotoUrl) {
  
      res.status(402).send({
        message: "Please enter complete information",
        data: {
          "productName": "new productName",
          "productPrice": "new productPrice",
          "productQuantity": "new productQuantity",
          "productCompany": "new productCompany",
          "productCategory": "new productCategory",
          "productDescription": "new productDescription",
          "productPhotoUrl": "new productPhotoUrl",
          "productGender": "new productGender"
        },
      });
  
      return;
    }else {
  
      let productAdd = await PRODUCTS.insertOne({

        "productPrice": productPrice,
        "productQuantity": productQuantity,
        "productCompany": productCompany,
        "productCategory": productCategory,
        "productDescription": productDescription,
        "productPhotoUrl": productPhotoUrl,
        "productGender": productGender,
        "addedDate": new Date().getTime(),
        "isDeleted": false,

      });
    
      
      let index = await PRODUCTS.createIndex({ content: 'text' })
      const response = PRODUCTS.find({productCategory: productCategory});
      let results = await response.toArray();
      res.status(200).send({message:"product added successfully" , data: results});
      return;
    }
  
    res.status(500).send("product not added server error");
  });
  

  
////////////////////////////////////////////////////////////
//////////////////////// getting all products///////////////////
////////////////////////////////////////////////////////////

router.get("/products", async (req, res) => {
  
    const response = PRODUCTS.find({isDeleted: false}, {});
  
    try{
  
    let results = await response.toArray()
    res.status(200).send({data: results , message : "getting all products successfully"});
    }
    catch(err){
    res.status(501).send({message :"error in sending all products from server"})
  }
  });
  

////////////////////////////////////////////////////////////
////////// getting a single category products///////////////
////////////////////////////////////////////////////////////

router.get("/products/:productGender/:productCategory", async (req, res) => {

  let Gender = req.params.productGender
  let category = req.params.productCategory
  
    const response = PRODUCTS.find({productGender: Gender , productCategory : category });
   
    try{
    let results = await response.toArray()
    res.status(200).send({data: results , message : "getting all single category product successfully"});
    }
    catch(err){
    res.status(501).send({message :"error in sending products from server"})
  }

  });


  ////////////////////////////////////////////////////////////
////////// getting user gender  products/////////////////////
////////////////////////////////////////////////////////////

router.get("/products/:gender", async (req, res) => {

  let gender = req.params.gender
  console.log(gender);
  
    const response = PRODUCTS.find({productGender: gender});
   
    try{
    let results = await response.toArray()
    res.status(200).send({data: results , message : "getting all products successfully"});
    }
    catch(err){
    res.status(501).send({message :"error in sending products from server"})
  }
  
  });
  
////////////////////////////////////////////////////////////
////////// searching products in collection ////////////////
////////////////////////////////////////////////////////////

router.get("/products/:query", async (req, res) => {

  let query = req.params.query
  
    const response = PRODUCTS.find(
      {$search: {
        index: "text",
        text: {query: query}
      }}
      );
   
    try{
    let results = await response.toArray()
    res.status(200).send({data: results , message : "getting all products successfully"});
    }
    catch(err){
    res.status(501).send({message :"error in sending products from server"})
  }
  
  });
  
  
  ////////////////////////////////////////////////////////////
  //////////////////////// deleting product///////////////////
  ////////////////////////////////////////////////////////////
  
  router.delete("/product/:id" , async (req, res) =>{
  
    let id = req.params.id;
    
    try {
  
      if(id){
  
        const deleteResponse = await PRODUCTS.deleteOne({ _id: new ObjectId(id) });
        const response = PRODUCTS.find({isDeleted: false});
        let results = await response.toArray()

        res.send({ message : "product deleted successfully" , data : results});    
        
    }
    else{
      res.send({message :"no product found with this id"})
      }
    } catch (error) {
      res.send({message :"error from server in deleting product"});
    }
  
  })
  
  ////////////////////////////////////////////////////////////
  //////////////////////// editing product///////////////////
  ////////////////////////////////////////////////////////////
  
  router.put("/product/:id" , async (req, res) =>{
  
    let id = req.params.id;
    let {productPrice , productDescription , productCompany , productName} = req.body;
    
    try {
  
      if(id){
  
        const updateResponse = await PRODUCTS.updateOne({ _id: new ObjectId(id)}, {
          $set: {'productPrice': productPrice , "productDescription": productDescription , "productName": productName , "productCompany": productCompany}
      });
        const response = PRODUCTS.find({isDeleted: false});
        let results = await response.toArray()

        res.send({ message : "product edit successfully" , data : results});    
        
    }
    else{
      res.send({message :"no product found with this id"})
      }
    } catch (error) {
      res.send({message :"error from server in editing product"});
    }
  
  })

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
/////////////     USER API'S         //////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


/
/////////////////////////////////////////////////////////
////////////////add products to cart///////////////////////
///////////////////////////////////////////////////////////

router.post("/addtocart", async (req, res) => {

  let { 

      productName
    , productPrice
    , productQuantity
    , productCompany
    , productCategory
    , productDescription
    , productGender
    , productPhotoUrl
    , productUnit
    , userName
    , email
    , gender
    , userId

  } = req.body
  
    if (!productName || !userId || !productPrice || !productQuantity || !productUnit || !productCompany || !productCategory || !productDescription || !productPhotoUrl || !userName || !email || !gender) {
  
      res.status(402).send({
        message: "Please enter complete information",
        data: {
          "productName": "new productName",
          "productPrice": "new productPrice",
          "productQuantity": "new productQuantity",
          "productCompany": "new productCompany",
          "productCategory": "new productCategory",
          "productDescription": "new productDescription",
          "productPhotoUrl": "new productPhotoUrl",
          "productGender": "new productGender"
          "productUnit" : "productUnit",
          "userName": "userName",
          "email": "email",
          "gender": "gender",
          "userId": "userId"
        },
      });
  
      return;
    }else {
  
      let productAdd = await PRODUCTS.insertOne({

        "productPrice": productPrice,
        "productQuantity": productQuantity,
        "productCompany": productCompany,
        "productCategory": productCategory,
        "productDescription": productDescription,
        "productPhotoUrl": productPhotoUrl,
        "productGender": productGender,
        "userName": userName,
        "email": email,
        "userId": userId,
        "gender": gender,
        "productUnit" : productUnit,
        "addedDate": new Date().getTime(),
        "isDeleted": false,

      });
    
      
      let index = await PRODUCTS.createIndex({ content: 'text' })
      const response = PRODUCTS.find({userId: userId});
      let results = await response.toArray();
      res.status(200).send({message:"product added to cart successfully" , data: results});
      return;
    }
  
    res.status(500).send("product not added server error");
  });
  

////////////////////////////////////////////////////////////
////////// getting cart products       /////////////////////
////////////////////////////////////////////////////////////

router.get("/products/:userId", async (req, res) => {

  let userId = req.params.userId
  
    const response = PRODUCTS.find({userId: userId});
   
    try{
    let results = await response.toArray()
    res.status(200).send({data: results , message : "getting all cart products successfully"});
    }
    catch(err){
    res.status(501).send({message :"error in sending products from server"})
  }
  
  });

    ////////////////////////////////////////////////////////////
  //////////////////////// editing product///////////////////
  ////////////////////////////////////////////////////////////
  
  router.put("/cart/:id" , async (req, res) =>{
  
    let id = req.params.id;

    let {productUnit , userId} = req.body;
    
    try {
  
      if(id){
  
        const updateResponse = await PRODUCTS.updateOne({ _id: new ObjectId(id)}, {
          $set: {'productUnit': productUnit}
      });
        const response = PRODUCTS.find({userId: userId});
        let results = await response.toArray()

        res.send({ message : "product edit successfully" , data : results});    
        
    }
    else{
      res.send({message :"no product found with this id"})
      }
    } catch (error) {
      res.send({message :"error from server in editing product"});
    }
  
  })


  ////////////////////////////////////////////////////////////
  //////////////////////// deleting cart product  ////////////
  ////////////////////////////////////////////////////////////
  
  router.delete("/cart/:id" , async (req, res) =>{
  
    let id = req.params.id;
    
    try {
  
      if(id){
  
        const deleteResponse = await PRODUCTS.deleteOne({ _id: new ObjectId(id) });
        const response = PRODUCTS.find({isDeleted: false});
        let results = await response.toArray()

        res.send({ message : "product deleted to cart successfully" , data : results});    
        
    }
    else{
      res.send({message :"no product found with this id"})
      }
    } catch (error) {
      res.send({message :"error from server in deleting product"});
    }
  
  })
  

  


  export default router;