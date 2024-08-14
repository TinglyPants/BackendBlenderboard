// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Node filesystem handling
const path = require("path");
const fs = require("fs");
const { isUuid } = require("uuidv4");

const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({
    storage: memStorage,
});

router.get("/image/:imageID", (req, res) => {
    if (!isUuid(path.parse(req.params.imageID).name)) {
        // If invalid UUID, reject
        res.status(400).send("Invalid filename");
        return;
    }
    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/image",
        req.params.imageID
    );
    // Check if file exists first
    if (fs.existsSync(searchPath)) {
        res.sendFile(searchPath);
    } else {
        res.send("No file found.");
    }
});

router.get("/video/:videoID", (req, res) => {
    if (!isUuid(path.parse(req.params.videoID).name)) {
        // If invalid UUID, reject
        res.status(400).send("Invalid filename");
        return;
    }
    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/video",
        req.params.videoID
    );
    // Check if file exists first
    if (fs.existsSync(searchPath)) {
        res.sendFile(searchPath);
    } else {
        res.send("No file found.");
    }
});

router.get("/model/:modelID", (req, res) => {
    if (!isUuid(path.parse(req.params.modelID).name)) {
        // If invalid UUID, reject
        res.status(400).send("Invalid filename");
        return;
    }
    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/model",
        req.params.modelID
    );
    // Check if file exists first
    if (fs.existsSync(searchPath)) {
        res.sendFile(searchPath);
    } else {
        res.send("No file found.");
    }
});

router.post(
    "/image/create/:filename",
    upload.fields([{ name: "image" }]),
    async (req, res) => {
        fs.writeFile(
            path.join(
                __dirname,
                "../../mediaStorage/image/",
                req.params.filename
            ),
            req.files.image[0].buffer,
            (err) => {
                if (err) {
                    res.status(500).send("Something went wrong saving file!");
                } else {
                    res.status(200).send("All good!");
                }
            }
        );
    }
);

router.post(
    "/video/create/:filename",
    upload.fields([{ name: "video" }]),
    async (req, res) => {
        fs.writeFile(
            path.join(
                __dirname,
                "../../mediaStorage/video/",
                req.params.filename
            ),
            req.files.video[0].buffer,
            (err) => {
                if (err) {
                    res.status(500).send("Something went wrong saving file!");
                } else {
                    res.status(200).send("All good!");
                }
            }
        );
    }
);

router.post(
    "/model/create/:filename",
    upload.fields([{ name: "model" }]),
    async (req, res) => {
        fs.writeFile(
            path.join(
                __dirname,
                "../../mediaStorage/model/",
                req.params.filename
            ),
            req.files.model[0].buffer,
            (err) => {
                if (err) {
                    res.status(500).send("Something went wrong saving file!");
                } else {
                    res.status(200).send("All good!");
                }
            }
        );
    }
);

module.exports = router;
