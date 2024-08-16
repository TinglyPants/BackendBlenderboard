// Handles HTTP routes
const express = require("express");
const router = express.Router();

// Parses multipart form data
const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({
    storage: memStorage,
});

// Loading endpoints
const { create } = require("./create");
const { login } = require("./login");

// Allows express to use json and urlencoded data (middleware)
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Used to test if user endpoint is available
router.get("/active", (req, res) => {
    res.status(200).send("User endpoint active!");
});

// Create
router.post("/create", upload.fields([{ name: "profileImage" }]), create);

// Read
router.get("/read", (req, res) => {});

router.post(
    "/login",
    // upload.none() because no files but uses formData
    upload.none(),
    login
);

// Update
router.put("/update", (req, res) => {});

// Delete
router.delete("/delete", (req, res) => {});

module.exports = router;
