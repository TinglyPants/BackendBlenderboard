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
const postsDB = mongoose.createConnection("mongodb://127.0.0.1:27017/postsDB");
// Gather post schema and make post model
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

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
    upload.fields([{ name: "images" }, { name: "video" }, { name: "model" }]),
    (req, res) => {
        // Create new instance of Post model to be saved in database
        const createdPost = new Post();

        // Guard clauses for title
        if (req.body.title === "") {
            res.status(400).send("You must have a title!");
            return;
        }
        if (req.body.title.length > 120) {
            res.status(400).send("Your title is too big!");
            return;
        }

        // Guard clauses for description
        if (req.body.description === "") {
            res.status(400).send("You must have a description!");
            return;
        }
        if (req.body.description.length > 3000) {
            res.status(400).send("Your description is too big!");
            return;
        }

        // Media presence check, ensures at least one image or one video
        if (req.files.images === undefined && req.files.video === undefined) {
            res.status(400).send("You must include media!");
            return;
        }

        // Media count checks
        if (req.files.images) {
            if (req.files.images.length > 12) {
                res.status(400).send("Too many images!");
                return;
            }
        }

        if (req.files.video) {
            if (req.files.video.length > 1) {
                res.status(400).send("Too many videos!");
                return;
            }
        }

        if (req.files.model) {
            if (req.files.model.length > 1) {
                res.status(400).send("Too many models!");
                return;
            }
        }

        createdPost.Title = req.body.title;
        createdPost.Description = req.body.description;
        createdPost.Author = null; // to be added in later prototype
        createdPost.Score = 0; // to be added in later prototype
        createdPost.DateOfCreation = Date.now();

        // File handling
        if (req.files.images) {
            req.files.images.forEach((image) => {
                const newFileName = uuid() + path.extname(image.originalname);

                createdPost.Images.push(newFileName);

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
        }

        if (req.files.video) {
            const newFileName =
                uuid() + path.extname(req.files.video[0].originalname);

            createdPost.Video = newFileName;

            const filePath = path.join(
                __dirname,
                "../../mediaStorage/video",
                newFileName
            );

            fs.writeFile(filePath, req.files.video[0].buffer, (err) => {
                if (err) {
                    console.log("Error saving video:" + err);
                }
            });
        }

        if (req.files.model) {
            const newFileName =
                uuid() + path.extname(req.files.model[0].originalname);

            createdPost.Model = newFileName;

            const filePath = path.join(
                __dirname,
                "../../mediaStorage/model",
                newFileName
            );

            fs.writeFile(filePath, req.files.model[0].buffer, (err) => {
                if (err) {
                    console.log("Error saving model:" + err);
                }
            });
        }

        createdPost.Comments.push(null); // to be added in later prototype

        createdPost.save();

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

        const postIDArray = [];
        posts.forEach((post) => {
            postIDArray.push(post._id.toString());
        });
        console.log(postIDArray);
        res.send(postIDArray);
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
