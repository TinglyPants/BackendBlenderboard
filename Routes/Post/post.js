const express = require("express");
const router = express.Router();

const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({ storage: memStorage });

// Loading endpoints
const { create } = require("./create");
const { read } = require("./read");
const { homepage } = require("./homepage");
const { userpage } = require("./userpage");
const {
    requiresAuth,
} = require("../../Middleware/Authentication/requiresAuth");

router.use(express.json());

router.get("/active", (req, res) => {
    res.status(200).send("Post endpoint active!");
});

router.post(
    "/create",
    // Upload middleware retrieves all files
    upload.fields([
        { name: "images" },
        { name: "video" },
        { name: "mesh" },
        { name: "alphaMap" },
        { name: "ambientOcclusionMap" },
        { name: "bumpMap" },
        { name: "displacementMap" },
        { name: "emissiveMap" },
        { name: "metalnessMap" },
        { name: "normalMap" },
        { name: "roughnessMap" },
        { name: "albedoMap" },
    ]),
    requiresAuth,
    create
);

router.get("/read/:postID", read);

router.get("/homepage", homepage);

router.get("/userpage/:userID", userpage);

router.put("/update", (req, res) => {
    res.status(501).send("Not Implemented");
});

router.delete("/delete/:postID", (req, res) => {
    res.status(501).send("Not Implemented");
});

module.exports = router;
