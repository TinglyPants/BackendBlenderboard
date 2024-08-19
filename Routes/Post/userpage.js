// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

const userpage = async (req, res) => {
    // 10 most recent posts
    try {
        const posts = await Post.find({
            Author: req.params.userID,
        })
            .sort({ DateOfCreation: "desc" })
            .exec();

        if (posts.length === 0) {
            res.status(404).send("No posts found for that user.");
            return;
        }

        const postIDArray = [];
        posts.forEach((post) => {
            postIDArray.push(post._id.toString());
        });

        res.send(postIDArray);
    } catch {
        res.status(400).send("Invalid ID");
    }
};

module.exports = { userpage };
