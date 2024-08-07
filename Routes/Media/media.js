// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Node filesystem handling
const path = require("path");
const fs = require("fs");

router.get("/image/:imageID", (req, res) => {
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

module.exports = router;
