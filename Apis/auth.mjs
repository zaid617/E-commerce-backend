import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db/dbConnect.mjs";
import jwt from "jsonwebtoken";

export const SECRET = process.env.SECRET || "topSecret";
const users = db.collection("users");
const router = express.Router();

//////////////////////////////////////////////////////////////////////////
////////////////// signup api ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

router.post("/signup", async (req, res) => {
  try {
    let { fullName, contact, email, password, dob } = req.body;

    if (!fullName || !contact || !email || !password || !dob) {
      res.status(402).send({
        message: "Please enter complete information",
        data: {
          FullName: "John",
          Contact: "Doe",
          dob: "1-1-1990",
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
        let first = fullName.slice(0, 1);
        first = first.toUpperCase();
        let remaining = firstName.slice(1);
        remaining = remaining.toLowerCase();
        fullName = first + remaining;
        email = email.toLowerCase();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hashSync(password, saltRounds);

        // Insert a single document, wait for promise so we can read it back
        let user = await users.insertOne({
          fullName: fullName,
          contact: contact,
          dob: dob,
          email: email,
          password: hashString,
          createdOn: new Date().getTime(),
        });

        res.status(200).send({
          message: "user successfully inserted",
          user: { fullName, contact, dob, email, password, createdOn },
        });
      }
    }
  } catch (err) {
    res.status(500).send("Server error: " + err);
  }
});

//////////////////////////////////////////////////////////////////////////
////////////////// login api /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await users.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compareSync(password, user.password);

      if (passwordMatch) {
        // Create and send a JWT token
        var token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          },
          SECRET
        );

        res.cookie("token", token, {
          maxAge: 86_400_000,
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });

        res.send({
          message: "Login successful",
          user: { fullName, contact, dob, email, password, createdOn },
        });
      } else {
        res.status(401).send({ message: "Invalid credentials" });
      }
    }
  } catch (error) {
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
