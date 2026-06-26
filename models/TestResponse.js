const mongoose = require("mongoose");

const testResponseSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    studentName: {
        type: String,
        trim: true
    },
    studentEmail: {
        type: String,
        lowercase: true,
        trim: true
    },
    studentPhone: {
        type: String,
        trim: true
    },
    responses: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        },
        selectedAnswer: String,
        submittedAnswer: String,
        isCorrect: Boolean,
        marksObtained: Number,
        timeSpent: Number
    }],
    answers: [{
        questionId: String,
        selectedAnswer: String,
        userInput: String,
        isCorrect: Boolean,
        marksObtained: Number
    }],
    totalMarks: {
        type: Number,
        default: 0
    },
    marksObtained: {
        type: Number,
        default: 0
    },
    obtainedMarks: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Pass", "Fail", "Not Attempted"],
        default: "Not Attempted"
    },
    isPassed: {
        type: Boolean,
        default: false
    },
    timeSpent: {
        type: Number,
        default: 0
    },
    startTime: Date,
    endTime: Date,
    submittedAt: Date,
    isSubmitted: {
        type: Boolean,
        default: false
    },
    evaluationStatus: {
        type: String,
        enum: ["Not Evaluated", "Evaluated", "Partially Evaluated"],
        default: "Not Evaluated"
    },
    feedback: {
        type: String,
        default: ""
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

module.exports = mongoose.model("TestResponse", testResponseSchema);
