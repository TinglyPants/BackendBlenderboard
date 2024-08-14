// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Parses multipart form data
const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({ storage: memStorage });

// loading endpoints
const { create } = require("./create");
const { read } = require("./read");
const { homepage } = require("./homepage");

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
    create
);

// Read
router.get("/read/:postID", read);

router.get("/homepage", homepage);

// Update
router.put("/update", (req, res) => {
    res.status(501).send("Not Implemented");
});

// Delete
router.delete("/delete/:postID", (req, res) => {
    res.status(501).send("Not Implemented");
});

module.exports = router;
