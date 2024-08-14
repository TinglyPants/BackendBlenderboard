// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

const read = async (req, res) => {
    try {
        const requestedID = req.params.postID;
        const requestedPost = await Post.findById(requestedID).exec();

        if (requestedPost === null) {
            res.status(404).send("Not Found");
        } else {
            const requestedPostObj = {
                title: requestedPost.Title,
                description: requestedPost.Description,
                author: requestedPost.Author,
                score: requestedPost.Score,
                dateOfCreation: requestedPost.DateOfCreation,
                images: requestedPost.Images,
                video: requestedPost.Video,
                model: requestedPost.Model,
                comments: requestedPost.Comments,
            };
            res.status(200).send(requestedPostObj);
        }
    } catch (err) {
        res.status(400).send("Invalid ID");
    }
};

module.exports = { read };
