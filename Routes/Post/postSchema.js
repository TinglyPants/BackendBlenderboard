// Schema for saving mongodb documents (destructured for simplicity)
const { Schema } = require("mongoose");

const postSchema = new Schema({
    Title: String,
    Description: String,
    Author: Schema.Types.ObjectId,
    Score: Number,
    DateOfCreation: Date,
    Images: [String],
    Video: String,
    Comments: [Schema.Types.ObjectId],
    Model: {
        Mesh: String,
        AlphaMap: String,
        AmbientOcclusionMap: String,
        BumpMap: String,
        DisplacementMap: String,
        EmissiveMap: String,
        MetalnessMap: String,
        NormalMap: String,
        IsTangentSpace: Boolean,
        RoughnessMap: String,
        AlbedoMap: String,
    },
});

module.exports = postSchema;
