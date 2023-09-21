import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db/dbConnect.mjs";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export const SECRET = process.env.SECRET || "topSecret";
const users = db.collection("users");
const router = express.Router();
const SECRET = process.env.SECRET || "topsceret";

//////////////////////////////////////////////////////////////////////////
////////////////// signup api ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

router.post("/signup", async (req, res) => {
  try {
    let { name, contact, ip, email, password, dob, gender } = req.body;

    if (!name || !contact || !email || !password || !dob || !gender || !ip) {
      res.status(402).send({
        message: "Please enter complete information",
        data: {
          name: "John",
          Contact: "Doe",
          dob: "1-1-1990",
          gender: "male / female",
          Email: "abc@abc.com",
          Password: "12345",
        },
      });
      return;
    } else {
      let isExist = await users.findOne({ email: email });

      if (isExist) {
        res.send({
          message: "user already exists",
        });
        return;
      } else {
        let first = name.slice(0, 1);
        first = first.toUpperCase();
        let remaining = name.slice(1);
        remaining = remaining.toLowerCase();
        name = first + remaining;
        email = email.toLowerCase();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hashSync(password, saltRounds);

        // Insert a single document, wait for promise so we can read it back
        let user = await users.insertOne({
          name: name,
          contact: contact,
          dob: dob,
          ip: ip,
          email: email,
          isAdmin: false,
          gender: gender,
          password: hashedPassword,
          createdOn: new Date().getTime(),
        });

        res.status(200).send({
          message: "user successfully inserted",
          user: {
            name,
            contact,
            dob,
            email,
            password,
            createdOn,
            gender,
            _id,
            isAdmin,
          },
        });

        // Create and send a JWT token
          var token = jwt.sign(
            {
              _id: data._id,
              email: data.email,
              iat: Math.floor(Date.now() / 1000) - 30,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            },
            SECRET
          );

          res.cookie("Token", token, {
            maxAge: 86_400_000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });
      }
    
  }} catch (err) {
    res.status(500).send("Server error: " + err);
  }
});

//////////////////////////////////////////////////////////////////////////
////////////////// login api /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  email = email.toLowerCase();

  try {
    // Check if the user exists
    const user = await users.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compareSync(password, user.password);

      if (passwordMatch) {
        let {
          name,
          contact,
          dob,
          email,
          password,
          createdOn,
          gender,
          _id,
          isAdmin,
          ip,
        } = user;

        // Create and send a JWT token
        if (isMatched) {
          var token = jwt.sign(
            {
              _id: data._id,
              email: data.email,
              iat: Math.floor(Date.now() / 1000) - 30,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            },
            SECRET
          );

          res.cookie("Token", token, {
            maxAge: 86_400_000,
            httpOnly: true,
            sameSite: "none",
            secure: true,
          });

        res.status(200).send({
          message: "Login successful",
          user: {
            name,
            contact,
            dob,
            email,
            password,
            createdOn,
            gender,
            _id,
            isAdmin,
            ip,
          },
        });
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    }
  }} catch (error) {
    res.status(500).json({ message: "Error logging in", error: error });
  }
});

//////////////////////////////////////////////////////////////////////////
////////////////// logout api ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

router.post("/logout", (req, res) => {
  // Clear the cookie containing the JWT token
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  // Send a response indicating successful logout
  res.send({ message: "Logged out successfully" });
});

export default router;
