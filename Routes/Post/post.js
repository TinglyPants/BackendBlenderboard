const express = require("express");
const router = express.Router();

const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({ storage: memStorage });

// Loading endpoints
const { create } = require("./create");
const { read } = require("./read");
const { homepage } = require("./homepage");

router.use(express.json());

router.get("/active", (req, res) => {
    res.status(200).send("Post endpoint active!");
});

router.post(
    "/create",
    // Upload middleware retrieves all files
    upload.fields([{ name: "images" }, { name: "video" }, { name: "model" }]),
    create
);

router.get("/read/:postID", read);

router.get("/homepage", homepage);

router.put("/update", (req, res) => {
    res.status(501).send("Not Implemented");
});

router.delete("/delete/:postID", (req, res) => {
    res.status(501).send("Not Implemented");
});

module.exports = router;
