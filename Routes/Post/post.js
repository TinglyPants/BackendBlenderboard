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

// Used to test if post endpoint is available
router.get("/active", (req, res) => {
    res.status(200).send("Post endpoint active!");
});

// Create
router.post("/create", (req, res) => {
    res.status(501).send("Not Implemented");
});

// Read
router.get("/read", (req, res) => {
    res.status(501).send("Not Implemented");
});

// Update
router.put("/update", (req, res) => {
    res.status(501).send("Not Implemented");
});

// Delete
router.delete("/delete", (req, res) => {
    res.status(501).send("Not Implemented");
});

module.exports = router;
