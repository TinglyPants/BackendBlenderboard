// MongoDB setup
const mongoose = require("mongoose");
const { commentDatabaseUrl } = require("../../Config/databaseUrls");
const commentsDB = mongoose.createConnection(commentDatabaseUrl);
const commentSchema = require("./commentSchema");
const Comment = commentsDB.model("Comment", commentSchema);

const read = async (req, res) => {
    const requestedID = req.params.commentID;
    let requestedComment;

    try {
        requestedComment = await Comment.findById(requestedID).exec();
    } catch (err) {
        res.status(400).send("Invalid ID.");
        return;
    }

    if (requestedComment === null) {
        res.status(404).send("Comment not found.");
        return;
    }

    const requestedCommentObj = {
        content: requestedComment.Content,
        author: requestedComment.Author.toString(),
        post: requestedComment.Post.toString(),
        score: requestedComment.Score,
        dateOfCreation: requestedComment.DateOfCreation,
    };

    res.status(200).send(requestedCommentObj);
};

module.exports = { read };
