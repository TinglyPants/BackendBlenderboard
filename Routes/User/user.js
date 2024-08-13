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

const { userDatabaseUrl } = require("../../Config/databaseUrls");

// Mongoose connection
const usersDB = mongoose.createConnection(userDatabaseUrl);

// Gather post schema and make post model
const userSchema = require("./userSchema");
const { isPresent } = require("../../Utils/isPresent");
const { isCorrectLength } = require("../../Utils/isCorrectLength");
const { isValidContent } = require("../../Utils/isValidContent");
const {
    emailRegex,
    standardAllowedCharRegex,
} = require("../../Config/regularExpresions");
const {
    usernameMin,
    usernameMax,
    bioMin,
    bioMax,
    emailMin,
    emailMax,
    passwordMin,
    passwordMax,
} = require("../../Config/inputLengthBounds");
const User = usersDB.model("User", userSchema);

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
        if (!isPresent(req.body.username)) {
            res.status(400).send("Please include a username.");
            return;
        }
        if (!isPresent(req.body.email)) {
            res.status(400).send("Please include an email.");
            return;
        }
        if (!isPresent(req.body.password)) {
            res.status(400).send("Please include a password.");
            return;
        }
        if (!isPresent(req.files.profileImage)) {
            res.status(400).send("Please include a profile image.");
            return;
        }

        // length checks
        if (!isCorrectLength(req.body.username, usernameMin, usernameMax)) {
            res.status(400).send(
                "Username is incorrect length (must be 1-26 chars!)"
            );
            return;
        }
        if (!isCorrectLength(req.body.email, emailMin, emailMax)) {
            res.status(400).send(
                "Email is incorrect length (must be 3-320 chars!)"
            );
            return;
        }
        if (!isCorrectLength(req.body.password, passwordMin, passwordMax)) {
            res.status(400).send(
                "Password is incorrect length (must be 8-40 chars!)"
            );
            return;
        }
        if (!isCorrectLength(req.body.bio, bioMin, bioMax)) {
            res.status(400).send("Bio is too long");
            return;
        }

        // content checks
        if (!isValidContent(req.body.email, emailRegex)) {
            res.status(400).send("Please use a valid email address");
            return;
        }
        if (!isValidContent(req.body.username, standardAllowedCharRegex)) {
            res.status(400).send("Invalid characters detected in username!");
            return;
        }
        if (!isValidContent(req.body.password, standardAllowedCharRegex)) {
            res.status(400).send("Invalid characters detected in password!");
            return;
        }
        if (
            req.body.bio.length > 0 &&
            !isValidContent(req.body.bio, standardAllowedCharRegex)
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
        createdUser.Password = hashedAndSaltedPassword;

        await createdUser.save();
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
