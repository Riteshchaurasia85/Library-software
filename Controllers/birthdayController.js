const Student = require("../models/Student");

// Get students with birthdays today
exports.getBirthdays = async (req, res) => {
    try {
        // Get all students
        const allStudents = await Student.find();

        // Get today's date (month and day)
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // getMonth returns 0-11
        const currentDay = today.getDate();

        // Filter students whose birthday is today
        const birthdayStudents = allStudents.filter((student) => {
            const dob = new Date(student.dateOfBirth);
            const dobMonth = dob.getMonth() + 1;
            const dobDay = dob.getDate();

            return dobMonth === currentMonth && dobDay === currentDay;
        });

        res.render("index", {
            activePage: 'birthday',
            content: 'pages/birthday',
            birthdayStudents,
            pageTitle: "Birthday",
            currentDate: today.toLocaleDateString('en-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        });
    } catch (error) {
        console.error("Error fetching birthdays:", error);
        res.status(500).render("index", {
            activePage: 'birthday',
            content: 'pages/birthday',
            birthdayStudents: [],
            pageTitle: "Birthday",
            error: "Failed to load birthday data"
        });
    }
};
