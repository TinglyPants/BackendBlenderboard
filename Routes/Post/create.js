// MongoDB setup
const mongoose = require("mongoose");
const { postDatabaseUrl } = require("../../Config/databaseUrls");
const postsDB = mongoose.createConnection(postDatabaseUrl);
const postSchema = require("./postSchema");
const Post = postsDB.model("Post", postSchema);

const { generateFilename } = require("../../Utils/generateFilename");
const { isPresent } = require("../../Utils/isPresent");
const { isCorrectLength } = require("../../Utils/isCorrectLength");
const {
    storeImage,
    storeVideo,
    storeModel,
} = require("../../Utils/storeMedia");
const {
    titleMin,
    titleMax,
    descriptionMin,
    descriptionMax,
} = require("../../Config/inputLengthBounds");

const create = async (req, res) => {
    // presence checks
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

    // length checks
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
    if (isPresent(req.files.model)) {
        if (req.files.model.length > 1) {
            res.status(400).send("Too many models!");
            return;
        }
    }

    // Create new instance of Post model to be saved in database
    const createdPost = new Post();

    createdPost.Title = req.body.title;
    createdPost.Description = req.body.description;
    createdPost.Author = null; // to be added in later prototype
    createdPost.Score = 0; // to be added in later prototype
    createdPost.DateOfCreation = Date.now();

    // File handling
    if (req.files.images) {
        for (let i = 0; i < req.files.images.length; i++) {
            const image = req.files.images[i];
            const newFilename = generateFilename(image.originalname);
            if (!storeImage(image.buffer, newFilename)) {
                res.status(500).send("Error saving file. Please try again");
                return;
            } else createdPost.Images.push(newFilename);
        }
    }

    if (req.files.video) {
        const newFilename = generateFilename(req.files.video[0].originalname);
        if (!storeVideo(req.files.video[0].buffer, newFilename)) {
            res.status(500).send("Error saving file. Please try again");
            return;
        } else createdPost.Video = newFilename;
    }

    if (req.files.model) {
        const newFilename = generateFilename(req.files.model[0].originalname);
        if (!storeModel(req.files.model[0].buffer, newFilename)) {
            res.status(500).send("Error saving file. Please try again");
            return;
        } else createdPost.Model = newFilename;
    }

    createdPost.Comments.push(null); // to be added in later prototype

    createdPost.save();

    res.status(200).send("Successful post creation");
};

module.exports = { create };
