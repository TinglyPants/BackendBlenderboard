// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Handles MongoDB
const mongoose = require("mongoose");

// Mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/postsDB");

// Gather post schema and make post model
const userSchema = require("./userSchema");
const User = mongoose.model("User", userSchema);

// Allows express to use json and urlencoded data (middleware)
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post("/create", (req, res) => {});

router.get("/read", (req, res) => {});

router.put("/update", (req, res) => {});

router.delete("/delete", (req, res) => {});

module.exports = router;
