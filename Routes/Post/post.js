// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Handles MongoDB
const mongoose = require("mongoose");
// Parses multipart form data
const multer = require("multer");
// Node filesystem handling
const path = require("path");
const fs = require("fs");

// Mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/postsDB");
// Gather post schema and make post model
const postSchema = require("./postSchema");
const Post = mongoose.model("Post", postSchema);

// Used to test if post endpoint is available
router.get("/active", (req, res) => {
    res.status(200).send("Post endpoint active!");
});

// Create
router.post("/create", (req, res) => {
    // Create new instance of Post model to be saved in database
    const createdPost = new Post();

    // Using fake data for testing purposes
    createdPost.Title = "Example Title";
    createdPost.Description = "Example Description";
    createdPost.Author = null; // to be added in later prototype
    createdPost.Score = 0; // to be added in later prototype
    createdPost.DateOfCreation = Date.now();
    createdPost.Model = "filename.obj";
    createdPost.Images.push("image1.png");
    createdPost.Images.push("image2.png");
    createdPost.Videos.push("video1.mp4");
    createdPost.Videos.push("video2.mp4");
    createdPost.Comments.push(null); // to be added in later prototype

    createdPost.save();

    res.status(200).send("Created post!");
});

// Read
router.get("/read/:postID", (req, res) => {
    // Wrapped in async IIFE for error handling
    (async () => {
        try {
            const requestedID = req.params.postID;
            const requestedPost = await Post.findById(requestedID).exec();

            if (requestedPost === null) {
                res.status(404).send("Not Found");
            } else {
                res.status(200).send(requestedPost);
            }
        } catch (err) {
            res.status(400).send("Invalid ID");
        }
    })();
});

router.get("/homepage", (req, res) => {
    // Gather list of given post IDs sorted by post date and send back
    (async () => {
        // 10 most recent posts.
        const posts = await Post.find()
            .sort({ DateOfCreation: "asc" })
            .limit(10)
            .exec();

        console.log(posts);
        res.send(posts);
    })();
});

// Update
router.put("/update", (req, res) => {
    res.status(501).send("Not Implemented");
});

// Delete
router.delete("/delete/:postID", (req, res) => {
    // Wrapped in async IIFE for error handling
    (async () => {
        try {
            const requestedID = req.params.postID;
            const result = await Post.deleteOne({
                _id: new mongoose.Types.ObjectId(requestedID),
            });

            if (result.deletedCount > 0) {
                res.status(200).send("Successfully deleted");
            } else {
                res.status(404).send("Post not found");
            }
        } catch (err) {
            // Post.deleteOne threw a BSON error
            res.status(400).send("Invalid ID");
        }
    })();
});

module.exports = router;
