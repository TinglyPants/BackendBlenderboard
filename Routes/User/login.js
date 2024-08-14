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
const { isValidContent } = require("../../Utils/isValidContent");

// Load config
const {
    emailRegex,
    standardAllowedCharRegex,
} = require("../../Config/regularExpressions");

// TODO: Add password reset options, limit password attempts. (This is for way ahead in the future)

const login = async (req, res) => {
    // Presence checks
    if (!isPresent(req.body.email)) {
        res.status(400).send("You must include an email!");
        return;
    }
    if (!isPresent(req.body.password)) {
        res.status(400).send("You must include a password!");
        return;
    }

    // Content checks
    if (!isValidContent(req.body.email, emailRegex)) {
        res.status(400).send("Please include a valid email.");
        return;
    }
    if (!isValidContent(req.body.password, standardAllowedCharRegex)) {
        res.status(400).send("Please include a valid password.");
        return;
    }

    // Attempt database lookup
    const searchedUser = await User.findOne({ Email: req.body.email }).exec();

    if (!isPresent(searchedUser)) {
        res.status(404).send("No user found with that email.");
    }

    // Check password
    if (await bcrypt.compare(req.body.password, searchedUser.Password)) {
        res.status(200).json({
            accessToken: generateToken({
                Username: searchedUser.Username,
                Bio: searchedUser.Bio,
                Email: searchedUser.Email,
                ProfileImage: searchedUser.ProfileImage,
                DateOfCreation: searchedUser.DateOfCreation,
                _id: searchedUser._id,
            }),
        });
    } else {
        res.status(400).send("Incorrect password.");
    }
};

module.exports = { login };
