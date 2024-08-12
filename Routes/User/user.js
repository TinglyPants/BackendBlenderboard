// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Handles MongoDB
const mongoose = require("mongoose");
// Parses multipart form data
const multer = require("multer");
// handles password security
const bcrypt = require("bcrypt");

const memStorage = multer.memoryStorage();
const upload = multer({
    storage: memStorage,
});

// Mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/usersDB");

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
router.post(
    "/create",
    upload.fields([{ name: "profileImage" }]),
    async (req, res) => {
        // presence checks
        if (req.body.username === "" || req.body.username === undefined) {
            res.status(400).send("Please include a username.");
            return;
        }
        if (req.body.email === "" || req.body.email === undefined) {
            res.status(400).send("Please include an email.");
            return;
        }
        if (req.body.password === "" || req.body.password === undefined) {
            res.status(400).send("Please include a password.");
            return;
        }
        if (req.files.profileImage === undefined) {
            res.status(400).send("Please include a profile image.");
            return;
        }

        // length checks
        if (req.body.username.length === 0 || req.body.username.length > 26) {
            res.status(400).send(
                "Username is incorrect length (must be 1-26 chars!)"
            );
            return;
        }
        if (req.body.password.length < 8 || req.body.password.length > 40) {
            res.status(400).send(
                "Password is incorrect length (must be 8-40 chars!)"
            );
            return;
        }
        if (req.body.bio.length > 3000) {
            res.status(400).send("Bio is too long");
            return;
        }

        // content checks
        const emailRegex =
            /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        if (emailRegex.test(req.body.email) === false) {
            res.status(400).send("Please use a valid email address");
            return;
        }
        const allowedCharsRegex = /^[a-zA-Z0-9!%&?#_\-+,\.\s]+$/;
        if (allowedCharsRegex.test(req.body.username) === false) {
            res.status(400).send("Invalid characters detected in username!");
            return;
        }
        if (allowedCharsRegex.test(req.body.password) === false) {
            res.status(400).send("Invalid characters detected in password!");
            return;
        }
        if (
            req.body.bio.length > 0 &&
            allowedCharsRegex.test(req.body.bio) === false
        ) {
            res.status(400).send("Invalid characters detected in bio!");
            return;
        }

        // existence check
        if ((await User.findOne({ Email: req.body.email }).exec()) !== null) {
            res.status(400).send("User with that email already exists!");
            return;
        }

        // password hashing + salting
        // This dictates the number of hash iterations. Higher = more secure but increased computation time
        const saltRounds = 10;
        const hashedAndSaltedPassword = await bcrypt.hash(
            req.body.password,
            saltRounds
        );

        const createdUser = new User();
        createdUser.Username = req.body.username;
        createdUser.Bio = req.body.bio;
        createdUser.Email = req.body.email;
        createdUser.password = hashedAndSaltedPassword;

        createdUser.save();
        res.status(200).send("Created User");
    }
);

// Read
router.get("/read", (req, res) => {});

// Update
router.put("/update", (req, res) => {});

// Delete
router.delete("/delete", (req, res) => {});

module.exports = router;
