const express = require("express");
const app = express();
const cors = require("cors");
const postRoutes = require("./post");

app.use(cors());
app.use(postRoutes);

app.listen(6000, () => {
    console.log("Post service listening on port: 6000");
});
