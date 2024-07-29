const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");

// Allowing for cross-origin resource sharing. (middleware)
app.use(cors());

// Connect post routes to main server
const postRoutes = require("./Routes/Post/post");
app.use("/posts", postRoutes);

// Listen on port 4000
app.listen(4000, () => {
    console.log("Server listening on port: 4000");
});
