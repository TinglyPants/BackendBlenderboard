const express = require("express");
const app = express();
const cors = require("cors");

// Allowing for cross-origin resource sharing. (middleware)
app.use(cors());

// Connect post routes to main server
const postRoutes = require("./Routes/Post/post");
app.use("/posts", postRoutes);

// Connect media routes to main server
const mediaRoutes = require("./Routes/Media/media");
app.use("/media", mediaRoutes);

// Connect user routes to main server
const userRoutes = require("./Routes/User/user");
app.use("/users", userRoutes);

const errorHandler = (err, req, res, next) => {
    if (err) {
        res.status(500).send(
            "Uh oh, Something went wrong! Please report this as soon as possible to help get the problem solved quickly."
        );
        console.log("Error!: ");
        console.log("---------------------------------------------");
        console.error(err);
        console.log("---------------------------------------------");
        // console.log("Request Data:");
        // console.log("---------------------------------------------");
        // console.dir(req);
        // console.log("---------------------------------------------");
    }
};

app.use(errorHandler);

// Listen on port 4000
app.listen(4000, () => {
    console.log("Server listening on port: 4000");
});
