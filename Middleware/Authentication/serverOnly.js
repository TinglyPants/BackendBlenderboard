require("dotenv").config();
const { isPresent } = require("../../Utils/isPresent");

const serverOnly = (req, res, next) => {
    if (!isPresent(req.body.serverSecret)) {
        res.status(401).send("Access denied.");
        return;
    }

    if (req.body.serverSecret !== process.env.SERVER_SECRET) {
        res.status(401).send("Access denied.");
        return;
    } else {
        next();
    }
};

module.exports = { serverOnly };
