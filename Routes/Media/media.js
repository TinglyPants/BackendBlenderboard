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

router.get("/mesh/:meshID", (req, res) => {
    if (!isUuid(path.parse(req.params.meshID).name)) {
        res.status(400).send("Invalid filename");
        return;
    }

    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/mesh",
        req.params.meshID
    );

    if (fs.existsSync(searchPath)) {
        res.sendFile(searchPath);
    } else {
        res.status(404).send("No file found.");
    }
});

router.get("/map/:mapID", (req, res) => {
    if (!isUuid(path.parse(req.params.mapID).name)) {
        res.status(400).send("Invalid filename");
        return;
    }

    const searchPath = path.join(
        __dirname,
        "../../mediaStorage/map",
        req.params.mapID
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
    "/mesh/create/:filename",
    upload.fields([{ name: "mesh" }]),
    async (req, res) => {
        fs.writeFile(
            path.join(
                __dirname,
                "../../mediaStorage/mesh/",
                req.params.filename
            ),
            req.files.mesh[0].buffer,
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
    "/map/create/:filename",
    upload.fields([{ name: "map" }]),
    async (req, res) => {
        fs.writeFile(
            path.join(
                __dirname,
                "../../mediaStorage/map/",
                req.params.filename
            ),
            req.files["map"][0].buffer,
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
