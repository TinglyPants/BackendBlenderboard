const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./user");

app.use(cors());
app.use(userRoutes);

app.listen(7000, () => {
    console.log("User service listening on port: 7000");
});
