const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    questionNumber: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["MCQ", "Subjective", "Code Editor", "True/False"],
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    options: [{
        optionText: String,
        isCorrect: { type: Boolean, default: false }
    }],
    expectedAnswer: {
        type: String,
        required: true
    },
    sampleAnswer: {
        type: String,
        default: ""
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    marks: {
        type: Number,
        default: 1,
        min: 0.5
    },
    explanation: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    },
    programmingLanguage: {
        type: String,
        default: "None"
    },
    testCases: [{
        input: String,
        output: String,
        isHidden: { type: Boolean, default: false }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Question", questionSchema);
