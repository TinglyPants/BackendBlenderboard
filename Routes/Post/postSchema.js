// Schema for saving mongodb documents (destructured for simplicity)
const { Schema } = require("mongoose");

const postSchema = new Schema({
    Title: String,
    Description: String,
    Author: Schema.Types.ObjectId,
    Score: Number,
    DateOfCreation: Date,
    Images: [String],
    Video: String,
    Comments: [Schema.Types.ObjectId],
    Model: String,
});

module.exports = postSchema;
