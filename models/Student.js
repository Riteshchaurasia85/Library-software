const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    dateOfBirth: { type: Date, required: true },
    shift: { type: String, required: true, trim: true },
    seatType: { type: String, required: true, trim: true },
    seatNumber: { type: String, required: false, trim: true },
    fees: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    joiningDate: { type: Date, required: true },
    paymentStatus: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", studentSchema);

