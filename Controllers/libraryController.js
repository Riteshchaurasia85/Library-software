const Course =
require('../models/courseModel');

// LIBRARY PAGE
exports.libraryPage =
async (req, res) => {

    const courses =
    await Course.find();

    res.render(
    'library',
    { courses }
    );
};

// ADD PAGE
exports.addPage =
(req, res) => {

    res.render(
    'addCourse'
    );
};

// SAVE COURSE
exports.addCourse =
async (req, res) => {

    const {
        title,
        time,
        icon
    } = req.body;

    await Course.create({

        title,
        time,
        icon

    });

    res.redirect(
    '/library'
    );
};