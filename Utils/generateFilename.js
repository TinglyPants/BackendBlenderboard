const { uuid } = require("uuidv4");
const path = require("node:path");

const generateFilename = (oldFilename) => {
    let newFilename = uuid();
    newFilename += path.extname(oldFilename);
    return newFilename;
};

module.exports = { generateFilename };
