const express = require("express");
const router = express.Router();

const path = require("path");
const fs = require("fs");
const { isUuid } = require("uuidv4");

const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({
    storage: memStorage,
});

//TODO: Implement security within the media creation endpoints to ensure only the server can create files, not any old user. Like auth protection but even higher access
// Also must add some functions to reduce duplication.

// READ //////////////////////////////////////////////////////////////
router.get("/image/:imageID", (req, res) => {
    if (!isUuid(path.parse(req.params.imageID).name)) {
        res.status(400).send("Invalid filename");
        return;
    }

    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/image",
        req.params.imageID
    );

    if (fs.existsSync(searchPath)) {
        res.sendFile(searchPath);
    } else {
        res.status(404).send("No file found.");
    }
});

router.get("/video/:videoID", (req, res) => {
    if (!isUuid(path.parse(req.params.videoID).name)) {
        res.status(400).send("Invalid filename");
        return;
    }

    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/video",
        req.params.videoID
    );

    if (fs.existsSync(searchPath)) {
        res.sendFile(searchPath);
    } else {
        res.status(404).send("No file found.");
    }
});

router.get("/model/:modelID", (req, res) => {
    if (!isUuid(path.parse(req.params.modelID).name)) {
        res.status(400).send("Invalid filename");
        return;
    }

    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/model",
        req.params.modelID
    );

    if (fs.existsSync(searchPath)) {
        res.sendFile(searchPath);
    } else {
        res.status(404).send("No file found.");
    }
});

// CREATE ////////////////////////////////////////////////////////////
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
