// Schema for saving mongodb documents (destructured for simplicity)
const { Schema } = require("mongoose");

const userSchema = new Schema({
    Username: String,
    Bio: String,
    Email: String,
    Password: String,
    DateOfCreation: Date,
    ProfileImage: String,
});

module.exports = userSchema;
