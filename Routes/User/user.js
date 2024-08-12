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

// Used to test if user endpoint is available
router.get("/active", (req, res) => {
    res.status(200).send("User endpoint active!");
});

// Create
router.post("/create", (req, res) => {});

// Read
router.get("/read", (req, res) => {});

// Update
router.put("/update", (req, res) => {});

// Delete
router.delete("/delete", (req, res) => {});

module.exports = router;
