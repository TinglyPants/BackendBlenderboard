// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

const homepage = async (req, res) => {
    // 10 most recent posts
    const posts = await Post.find()
        .sort({ DateOfCreation: "desc" })
        .limit(100)
        .exec();

    const postIDArray = [];
    posts.forEach((post) => {
        postIDArray.push(post._id.toString());
    });

    res.send(postIDArray);
};

module.exports = { homepage };
