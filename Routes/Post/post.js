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
const { search } = require("./search");
const {
    requiresAuth,
} = require("../../Middleware/Authentication/requiresAuth");
const { serverOnly } = require("../../Middleware/Authentication/serverOnly");
const { deletePost } = require("./delete");
const { addComment } = require("./addComment");

router.use(express.json());

router.get("/active", (req, res) => {
    res.status(200).send("Post endpoint active!");
});

router.post(
    "/create",
    // Upload middleware retrieves all files
    upload.fields([{ name: "images" }, { name: "video" }, { name: "model" }]),
    requiresAuth,
    create
);

router.get("/read/:postID", read);

router.get("/homepage", homepage);

router.get("/userpage/:userID", userpage);

router.get("/search/:searchQuery", search);

router.put("/update", (req, res) => {
    res.status(501).send("Not Implemented");
});

router.delete("/delete/:postID", upload.none(), requiresAuth, deletePost);

router.post("/add-comment/:postID", upload.none(), serverOnly, addComment);

module.exports = router;
