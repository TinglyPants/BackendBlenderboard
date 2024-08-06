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
const { uuid } = require("uuidv4");

// Mongoose connection
mongoose.connect("mongodb://127.0.0.1:27017/postsDB");
// Gather post schema and make post model
const postSchema = require("./postSchema");
const Post = mongoose.model("Post", postSchema);

// Setting up multer (middleware)
// Stores files in memory as a buffer
const memStorage = multer.memoryStorage();

const isValidFile = (allowedMimeTypes, filenameRegex, file) => {
    if (allowedMimeTypes !== null) {
        // if mimetype invalid, reject file
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return false;
        }
    }

    // if filename invalid, reject file
    if (!filenameRegex.test(file.originalname.toLowerCase())) {
        return false;
    }

    // all good, therefore can allow through
    return true;
};

const upload = multer({
    storage: memStorage,
    // function to filter invalid files appropriately
    fileFilter: (req, file, cb) => {
        switch (file.fieldname) {
            case "images":
                // image file filtering
                return cb(
                    null,
                    isValidFile(
                        ["image/png", "image/jpeg", "image/gif", "image/webp"],
                        /(.png|.jpg|.jpeg|.gif|.webp)$/,
                        file
                    )
                );
                break;
            case "video":
                // video file filtering
                return cb(
                    null,
                    isValidFile(
                        ["video/mp4", "video/webm", "video/ogg"],
                        /(.mp4|.webm|.ogg)$/,
                        file
                    )
                );
                break;
            case "model":
                // model file filtering
                return cb(
                    null,
                    isValidFile(null, /(.obj|.fbx|.stl|.gltf|.glb|.dae)$/, file)
                );
                break;
            default:
                return cb(null, false);
                break;
        }
    },
});

// Allows express to use json and urlencoded data (middleware)
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Used to test if post endpoint is available
router.get("/active", (req, res) => {
    res.status(200).send("Post endpoint active!");
});

// Create
router.post(
    "/create",
    // upload middleware retrieves all files
    upload.fields([
        { name: "images", maxCount: 12 },
        { name: "video", maxCount: 1 },
        { name: "model", maxCount: 1 },
    ]),
    (req, res) => {
        // Create new instance of Post model to be saved in database
        const createdPost = new Post();

        // Guard clauses
        if (req.body.title === "") {
            res.status(400).send("You must have a title!");
        }
        if (req.body.description === "") {
            res.status(400).send("You must have a description!");
        }

        createdPost.Title = req.body.title;
        createdPost.Description = req.body.description;
        createdPost.Author = null; // to be added in later prototype
        createdPost.Score = 0; // to be added in later prototype
        createdPost.DateOfCreation = Date.now();

        // File handling section
        req.files.images.forEach((image) => {
            console.log(image.originalname);
            const newFileName = uuid() + path.extname(image.originalname);
            const filePath = path.join(
                __dirname,
                "../../mediaStorage/image",
                newFileName
            );
            fs.writeFile(filePath, image.buffer, (err) => {
                if (err) {
                    console.log("Error saving image:" + err);
                }
            });
        });

        createdPost.Comments.push(null); // to be added in later prototype

        //createdPost.save();

        res.status(200).send({ success: true });
    }
);

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
            .sort({ DateOfCreation: "desc" })
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
