// MongoDB setup
const mongoose = require("mongoose");
const { commentDatabaseUrl } = require("../../Config/databaseUrls");
const commentsDB = mongoose.createConnection(commentDatabaseUrl);
const commentSchema = require("./commentSchema");
const Comment = commentsDB.model("Comment", commentSchema);

const { isPresent } = require("../../Utils/isPresent");
const { isCorrectLength } = require("../../Utils/isCorrectLength");
const { isValidContent } = require("../../Utils/isValidContent");
const { assignCommentToPost } = require("../../Utils/assignCommentToPost");
const { standardAllowedCharRegex } = require("../../Config/regularExpressions");
const { commentMin, commentMax } = require("../../Config/inputLengthBounds");

const create = async (req, res) => {
    // Comment content, comment content + length
    // post ID - need to verify post exists and is valid (handled in post endpoint tho)
    // presence checks
    if (!isPresent(req.body.content)) {
        res.status(400).send("Please include comment content.");
        return;
    }
    if (!isPresent(req.body.postID)) {
        res.status(400).send("Post ID not provided.");
        return;
    }

    // content checks
    if (!isCorrectLength(req.body.content, commentMin, commentMax)) {
        res.status(400).send("Comment content is too big.");
        return;
    }
    if (!isValidContent(req.body.content, standardAllowedCharRegex)) {
        res.status(400).send("Comment contains forbidden characters.");
        return;
    }

    // Create comment instance
    let createdComment;
    try {
        createdComment = new Comment({
            Content: req.body.content,
            Author: new mongoose.Types.ObjectId(req.user._id),
            DateOfCreation: Date.now(),
            Score: 0,
            Post: new mongoose.Types.ObjectId(req.body.postID),
        });
    } catch (err) {
        res.status(400).send("Something went wrong, please attempt later.");
        return;
    }

    // Contact post endpoint to assign comment to post
    if (
        !(await assignCommentToPost(
            createdComment._id.toString(),
            req.body.postID
        ))
    ) {
        res.status(500).send("Something went wrong, please try again.");
        return;
    } else {
        await createdComment.save();
        res.status(200).send("Success!");
    }
};

module.exports = { create };
