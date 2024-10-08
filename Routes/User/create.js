// MongoDB setup
const mongoose = require("mongoose");
const { userDatabaseUrl } = require("../../Config/databaseUrls");
const usersDB = mongoose.createConnection(userDatabaseUrl);
const userSchema = require("./userSchema");
const User = usersDB.model("User", userSchema);

// Security
const bcrypt = require("bcrypt");

// Load utils
const { isPresent } = require("../../Utils/isPresent");
const { isCorrectLength } = require("../../Utils/isCorrectLength");
const { isValidContent } = require("../../Utils/isValidContent");
const { storeImage } = require("../../Utils/storeMedia");
const { generateFilename } = require("../../Utils/generateFilename");
const { isValidImage } = require("../../Utils/isValidMedia");

// Load config
const {
    emailRegex,
    standardAllowedCharRegex,
    passwordRegex,
} = require("../../Config/regularExpressions");
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
const { generateToken } = require("../../Utils/generateToken");

// TODO: Definitely need to reduce the repetition in these endpoints... Later I will. Otherwise this is OK.

const create = async (req, res) => {
    // Presence checks
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

    // Length checks
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

    // Content checks
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
    if (!isValidImage(req.files.profileImage[0])) {
        res.status(400).send(
            "Invalid profile image file: " +
                req.files.profileImage[0].originalname
        );
        return;
    }
    if (!isValidContent(req.body.password, passwordRegex)) {
        res.status(400).send(
            "Password must contain at least one capital letter and one number"
        );
        return;
    }

    // Existence check
    if ((await User.findOne({ Email: req.body.email }).exec()) !== null) {
        res.status(400).send("User with that email already exists!");
        return;
    }

    // Password hashing + salting
    const hashedAndSaltedPassword = await bcrypt.hash(req.body.password, 10);

    // Image saving
    const newFilename = generateFilename(
        req.files.profileImage[0].originalname
    );
    if (!storeImage(req.files.profileImage[0].buffer, newFilename)) {
        res.status(500).send("Error saving file. Please try again");
        return;
    }

    const createdUser = new User({
        Username: req.body.username,
        Bio: req.body.bio,
        Email: req.body.email,
        Password: hashedAndSaltedPassword,
        ProfileImage: newFilename,
        DateOfCreation: Date.now(),
    });

    await createdUser.save();
    res.status(200).json({
        accessToken: generateToken({
            Username: req.body.username,
            Bio: req.body.bio,
            Email: req.body.email,
            ProfileImage: newFilename,
            DateOfCreation: createdUser.DateOfCreation,
            _id: createdUser._id,
        }),
    });
};

module.exports = { create };
