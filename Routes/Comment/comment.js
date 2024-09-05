const express = require("express");
const router = express.Router();

const multer = require("multer");
const memStorage = multer.memoryStorage();
const upload = multer({ storage: memStorage });

const {
    requiresAuth,
} = require("../../Middleware/Authentication/requiresAuth");

router.use(express.json());

router.get("/active", (req, res) => {
    res.status(200).send("Comment endpoint active!");
});

router.post("/create", upload.none(), requiresAuth);

router.get("/read/:commentID");

router.put("/update/:commentID");

router.delete("/delete/:commentID");

module.exports = router;
