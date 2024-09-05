// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

// Loading utils
const { generateFilename } = require("../../Utils/generateFilename");
const { isPresent } = require("../../Utils/isPresent");
const { isCorrectLength } = require("../../Utils/isCorrectLength");
const {
    isValidImage,
    isValidVideo,
    isValidModel,
} = require("../../Utils/isValidMedia");
const {
    storeImage,
    storeVideo,
    storeModel,
} = require("../../Utils/storeMedia");

// Loading config
const {
    titleMin,
    titleMax,
    descriptionMin,
    descriptionMax,
} = require("../../Config/inputLengthBounds");

// TODO: Reduce the repetition in checks by adding some functions.

const create = async (req, res) => {
    // Presence checks
    if (!isPresent(req.body.title)) {
        res.status(400).send("Please include a title.");
        return;
    }
    if (!isPresent(req.body.description)) {
        res.status(400).send("Please include a description.");
        return;
    }
    if (!isPresent(req.files.images) && !isPresent(req.files.video)) {
        res.status(400).send("You must include media!");
        return;
    }

    // Length checks
    if (!isCorrectLength(req.body.title, titleMin, titleMax)) {
        res.status(400).send("Your title is too big!");
        return;
    }
    if (
        !isCorrectLength(req.body.description, descriptionMin, descriptionMax)
    ) {
        res.status(400).send("Your description is too big!");
        return;
    }

    // Media count checks
    if (isPresent(req.files.images)) {
        if (req.files.images.length > 12) {
            res.status(400).send("Too many images!");
            return;
        }
    }
    if (isPresent(req.files.video)) {
        if (req.files.video.length > 1) {
            res.status(400).send("Too many videos!");
            return;
        }
    }

    // Media validation
    if (isPresent(req.files.images)) {
        for (let i = 0; i < req.files.images.length; i++) {
            if (!isValidImage(req.files.images[i])) {
                res.status(400).send(
                    "Invalid image file: " + req.files.images[i].originalname
                );
                return;
            }
        }
    }
    if (isPresent(req.files.video)) {
        if (!isValidVideo(req.files.video[0])) {
            res.status(400).send(
                "Invalid video file: " + req.files.video[0].originalname
            );
            return;
        }
    }

    // Model validation
    if (isPresent(req.files.model)) {
        if (req.files.model.length > 1) {
            res.status(400).send("Too many models!");
            return;
        }
        if (!isValidModel(req.files.model[0])) {
            res.status(400).send(
                "Invalid model file: " + req.files.model[0].originalname
            );
            return;
        }
    }

    const createdPost = new Post({
        Title: req.body.title,
        Description: req.body.description,
        Author: new mongoose.Types.ObjectId(req.user._id),
        Score: 0, // to be added in later prototype
        DateOfCreation: Date.now(),
    });

    // Model storage
    if (isPresent(req.files.model)) {
        const newFilename = generateFilename(req.files.model[0].originalname);
        if (!(await storeModel(req.files.model[0].buffer, newFilename))) {
            res.status(500).send("Error saving file. Please try again");
            return;
        } else createdPost.Model = newFilename;
    }

    // Media storage
    if (isPresent(req.files.images)) {
        for (let i = 0; i < req.files.images.length; i++) {
            const image = req.files.images[i];
            const newFilename = generateFilename(image.originalname);

            if (!(await storeImage(image.buffer, newFilename))) {
                res.status(500).send("Error saving file. Please try again");
                return;
            } else createdPost.Images.push(newFilename);
        }
    }
    if (isPresent(req.files.video)) {
        const newFilename = generateFilename(req.files.video[0].originalname);
        if (!(await storeVideo(req.files.video[0].buffer, newFilename))) {
            res.status(500).send("Error saving file. Please try again");
            return;
        } else createdPost.Video = newFilename;
    }

    await createdPost.save();

    res.status(200).send("Successful post creation");
};

module.exports = { create };
