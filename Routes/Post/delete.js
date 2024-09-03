// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

// cannot have "delete" as a function name.
const deletePost = async (req, res) => {
    const requestedID = req.params.postID;
    let requestedPost = null;

    try {
        requestedPost = await Post.findById(requestedID).exec();
    } catch (err) {
        console.log(err);
        res.status(400).send("Invalid ID");
        return;
    }

    if (requestedPost === null) {
        res.status(404).send("Not Found");
        return;
    }

    // Ensures user trying to delete post is author
    if (requestedPost.Author.toString() !== req.user._id) {
        res.status(403).send("You do not have permission to delete this post!");
        return;
    }

    await Post.deleteOne({ _id: requestedID });
    res.status(200).send("Successful post deletion");
};

module.exports = { deletePost };
