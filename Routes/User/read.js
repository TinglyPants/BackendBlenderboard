// MongoDB setup
const mongoose = require("mongoose");
const { userDatabaseUrl } = require("../../Config/databaseUrls");
const usersDB = mongoose.createConnection(userDatabaseUrl);
const userSchema = require("./userSchema");
const { isPresent } = require("../../Utils/isPresent");
const User = usersDB.model("User", userSchema);

const read = async (req, res) => {
    try {
        const requestedUser = await User.findById(req.params.userID).exec();

        if (!isPresent(requestedUser)) {
            req.status(404).send("No user found with that ID.");
        } else {
            const requestedUserObj = {
                username: requestedUser.Username,
                bio: requestedUser.Bio,
                email: requestedUser.Email,
                dateOfCreation: requestedUser.DateOfCreation,
                profileImage: requestedUser.ProfileImage,
            };

            res.status(200).send(requestedUserObj);
        }
    } catch {
        res.status(400).send("Invalid ID");
    }
};

module.exports = { read };
