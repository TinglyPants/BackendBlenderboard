require("dotenv").config();
const { isPresent } = require("../../Utils/isPresent");
const jwt = require("jsonwebtoken");

const requiresAuth = (req, res, next) => {
    if (!isPresent(req.body.accessToken)) {
        res.status(401).send("You must log in or sign up!");
        return;
    }

    jwt.verify(
        req.body.accessToken,
        process.env.TOKEN_SECRET,
        (err, payload) => {
            if (err) {
                console.log(err);
                res.status(403).send("Token invalid, please log in!");
                return;
            } else {
                console.log(payload);
                req.user = payload;
                next();
            }
        }
    );
};

module.exports = { requiresAuth };
