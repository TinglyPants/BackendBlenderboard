const {
    imageExtRegex,
    videoExtRegex,
    modelExtRegex,
} = require("../Config/regularExpressions");
const {
    imageMimeTypes,
    videoMimeTypes,
} = require("../Config/allowedMimeTypes");

const isValidImage = (image) => {
    if (!imageMimeTypes.includes(image.mimetype)) {
        return false;
    }
    if (!imageExtRegex.test(image.originalname.toLowerCase())) {
        return false;
    }

    return true;
};

const isValidVideo = (video) => {
    if (!videoMimeTypes.includes(video.mimetype)) {
        return false;
    }
    if (!videoExtRegex.test(video.originalname.toLowerCase())) {
        return false;
    }

    return true;
};

const isValidModel = (model) => {
    if (!modelExtRegex.test(model.originalname.toLowerCase())) {
        return false;
    }

    return true;
};

module.exports = { isValidImage, isValidVideo, isValidModel };
