// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Handles MongoDB
const mongoose = require("mongoose");
// Parses multipart form data
const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({
    storage: memStorage,
});

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
router.post("/create", upload.fields(["profileImage"]), (req, res) => {
    // presence checks
    if (req.body.username === undefined) {
        res.status(400).send("Please include a username.");
        return;
    }
    if (req.body.bio === undefined) {
        res.status(400).send("Please include a bio.");
        return;
    }
    if (req.body.email === undefined) {
        res.status(400).send("Please include an email.");
        return;
    }
    if (req.body.password === undefined) {
        res.status(400).send("Please include a password.");
        return;
    }
    if (req.files.profileImage === undefined) {
        res.status(400).send("Please include a profile image.");
        return;
    }
});

// Read
router.get("/read", (req, res) => {});

// Update
router.put("/update", (req, res) => {});

// Delete
router.delete("/delete", (req, res) => {});

module.exports = router;
