// Handles HTTP routes
const express = require("express");
const router = express.Router();
// Parses multipart form data
const multer = require("multer");
// Setting up multer (middleware)
// Stores files in memory as a buffer
const memStorage = multer.memoryStorage();

const isValidFile = (allowedMimeTypes, filenameRegex, file) => {
    if (allowedMimeTypes !== null) {
        // if mimetype invalid, reject file
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return false;
        }
    }

    // if filename invalid, reject file
    if (!filenameRegex.test(file.originalname.toLowerCase())) {
        return false;
    }

    // all good, therefore can allow through
    return true;
};

const upload = multer({
    storage: memStorage,
    // function to filter invalid files appropriately
    fileFilter: (req, file, cb) => {
        switch (file.fieldname) {
            case "images":
                // image file filtering
                return cb(
                    null,
                    isValidFile(
                        ["image/png", "image/jpeg", "image/gif", "image/webp"],
                        /(.png|.jpg|.jpeg|.gif|.webp)$/,
                        file
                    )
                );
                break;
            case "video":
                // video file filtering
                return cb(
                    null,
                    isValidFile(
                        ["video/mp4", "video/webm", "video/ogg"],
                        /(.mp4|.webm|.ogg)$/,
                        file
                    )
                );
                break;
            case "model":
                // model file filtering
                return cb(
                    null,
                    isValidFile(null, /(.obj|.fbx|.stl|.gltf|.glb|.dae)$/, file)
                );
                break;
            default:
                return cb(null, false);
                break;
        }
    },
});

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
