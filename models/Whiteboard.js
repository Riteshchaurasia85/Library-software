const mongoose = require("mongoose");

const whiteboardSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageData: { type: String, required: true }, // Base64 encoded image
    drawingData: { type: String, required: true }, // JSON stringified drawing data for recovery
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String }],
    collaborators: [{ type: String }]
});

module.exports = mongoose.model("Whiteboard", whiteboardSchema);
