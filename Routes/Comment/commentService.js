const express = require("express");
const app = express();
const cors = require("cors");
const commentRoutes = require("./comment");

app.use(cors());
app.use(commentRoutes);

app.listen(5000, () => {
    console.log("Comment service listening on port: 5000");
});
