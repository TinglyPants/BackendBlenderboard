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
    const requestedID = req.params.postID;
    const requestedPost = Post.findById(requestedID).exec();

    res.status(200).send(requestedPost);
});

// Update
router.put("/update", (req, res) => {
    res.status(501).send("Not Implemented");
});

// Delete
router.delete("/delete", (req, res) => {
    res.status(501).send("Not Implemented");
});

module.exports = router;
