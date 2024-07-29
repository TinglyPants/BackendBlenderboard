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

router.get("/active", (req, res) => {
    res.status(200).send("Post endpoint active!");
});

module.exports = router;
