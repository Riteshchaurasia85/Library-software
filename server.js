const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const methodOverride = require("method-override");
const testRoutes = require("./routes/testRoutes");
const calculationRoutes = require('./routes/calculationRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const pagesRoutes = require('./routes/pagesRoutes');
const studentRoutes = require('./routes/studentRoutes');
const apiRoutes = require('./routes/apiRoutes');
const Student = require('./models/Student');
const Whiteboard = require('./models/Whiteboard');
const birthdayRoutes = require("./routes/birthdayRoutes");
const whiteboardRoutes = require("./routes/whiteboardRoutes");


const app = express();
dotenv.config();

// Database connect
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.warn("MongoDB connection failed:", error.message);
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// views engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const pageData = {
    "support": "Support",
    "contact": "Contact",
    "views-seat": "Views Seat",
    "library-tools": "Library Tools",
    "create-ppt": "Create ppt",
};
    // Mount modular route handlers
    app.use('/', calculationRoutes);
    app.use('/', libraryRoutes);
    app.use('/', pagesRoutes);
    app.use('/', studentRoutes);
    app.use("/", birthdayRoutes);
    app.use('/', testRoutes);
    app.use('/api', apiRoutes);
    app.use('/api', whiteboardRoutes);
    app.use('/tests', testRoutes);

// server create krna or run
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
