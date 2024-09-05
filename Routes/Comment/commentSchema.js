// Schema for saving mongodb documents (destructured for simplicity)
const { Schema } = require("mongoose");

const commentSchema = new Schema({
    Content: String,
    Author: Schema.Types.ObjectId,
    Post: Schema.Types.ObjectId,
    Score: Number,
    DateOfCreation: Date,
});

module.exports = commentSchema;
