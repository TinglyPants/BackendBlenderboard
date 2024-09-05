// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const { isPresent } = require("../../Utils/isPresent");
const Post = postsDB.model("Post", postSchema);

const addComment = async (req, res) => {
    const requestedID = req.params.postID;
    let requestedPost;

    if (!isPresent(req.body.commentID)) {
        res.status(400).send("Missing comment ID.");
        return;
    }

    try {
        requestedPost = await Post.findById(requestedID).exec();
    } catch (err) {
        res.status(400).send("Invalid ID");
        return;
    }

    if (requestedPost === null) {
        res.status(404).send("No post found with that ID.");
        return;
    }

    requestedPost.Comments.push(
        new mongoose.Types.ObjectId(req.body.commentID)
    );
    await requestedPost.save();
    res.status(200).send("Success");
};

module.exports = { addComment };
