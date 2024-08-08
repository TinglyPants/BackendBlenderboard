// Schema for saving mongodb documents (destructured for simplicity)
const { Schema } = require("mongoose");

const postSchema = new Schema({
    Title: String,
    Description: String,
    Author: Schema.Types.ObjectId,
    Score: Number,
    DateOfCreation: Date,
    Model: String,
    Images: [String],
    Video: String,
    Comments: [Schema.Types.ObjectId],
});

module.exports = postSchema;
