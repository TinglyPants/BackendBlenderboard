// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

const { titleMax } = require("../../Config/inputLengthBounds");
const { standardAllowedCharRegex } = require("../../Config/regularExpressions");

const search = async (req, res) => {
    let searchQuery = req.params.searchQuery;

    // Remove forbidden characters
    searchQuery = searchQuery.replace(
        new RegExp(`[^${standardAllowedCharRegex.source.slice(2, -3)}]`, "g"), // Slice needed to remove "^[" at start, and "]+$" at end. "[^...]" negates the inside expression. "g" means regex will not stop at first match
        " "
    );

    // Length truncation
    if (searchQuery.length > titleMax) {
        searchQuery = searchQuery.slice(0, titleMax);
    }

    const allPosts = await Post.find({
        Title: new RegExp(searchQuery, "i"),
    })
        .sort({ DateOfCreation: "desc" })
        .limit(100)
        .exec();

    const postIDArray = [];
    allPosts.forEach((post) => {
        postIDArray.push(post._id.toString());
    });

    res.status(200).send(postIDArray);
};

module.exports = { search };
