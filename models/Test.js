const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
    testId: {
        type: String,
        unique: true,
        sparse: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        default: "Custom",
        trim: true
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    passingPercentage: {
        type: Number,
        default: 40,
        min: 0,
        max: 100
    },
    duration: {
        type: Number,
        default: 60,
        min: 1
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Medium"
    },
    createdBy: {
        type: String,
        default: "Admin",
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    publishType: {
        type: String,
        enum: ["private", "link", "students", "public"],
        default: "private"
    },
    publicLink: {
        type: String,
        unique: true,
        sparse: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    settings: {
        showAnswerAfter: {
            type: String,
            enum: ["no", "immediately", "after_completion"],
            default: "after_completion"
        },
        shuffleQuestions: {
            type: Boolean,
            default: true
        },
        shuffleOptions: {
            type: Boolean,
            default: true
        },
        allowReview: {
            type: Boolean,
            default: true
        },
        negativeMarking: {
            type: Boolean,
            default: false
        },
        negativeMarkValue: {
            type: Number,
            default: 0
        },
        instructions: {
            type: String,
            default: ""
        }
    },
    viewCount: {
        type: Number,
        default: 0
    },
    attemptCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Test", testSchema);
