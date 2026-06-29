const Student = require('../models/Student');
const Test = require('../models/Test');
const Question = require('../models/Question');

const pageData = {
    "support": "Support",
    "contact": "Contact",
    "views-seat": "Views Seat",
    "library-tools": "Library Tools",
    "create-ppt": "Create ppt",
    "create-cv": "Create cv",
    "e-book": "E-book",
    "birthday": "BirthDay",
    "internship": "Internship",
    "govt-job": "Govt Job",
    "tech": "Tech",
    "reg-student": "Reg. Student",
    "student-list": "Student List",
    "create-tests": "Create Tests",
    "register-form": "Register Form",
    "calculator": "Calculator",
    "news": "News"
};

exports.rootRedirect = (req, res) => res.redirect('/dashboard');

exports.dashboard = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 }) || [];

        const dashboardSeats = students.map((student) => {
            const currentSeatType = student.seatType ? student.seatType.toString().trim() : "";
            return {
                id: student._id,
                number: student.seatNumber || "N/A",
                status: (currentSeatType.toLowerCase() === "reserved") ? 'Reverse' : 'Unreserve',
                student: student.fullName || "Unknown",
                updated: 'Just now'
            };
        });

        const reverseCount = dashboardSeats.filter(seat => seat.status === 'Reverse').length;
        const unreserveCount = dashboardSeats.filter(seat => seat.status === 'Unreserve').length;

        res.render('index', {
            activePage: 'dashboard',
            content: 'pages/dashboard',
            pageTitle: 'Dashboard',
            dashboardSeats,
            reverseCount,
            unreserveCount,
            success: false
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.render('index', {
            activePage: 'dashboard',
            content: 'pages/dashboard',
            pageTitle: 'Dashboard',
            dashboardSeats: [],
            reverseCount: 0,
            unreserveCount: 0,
            success: false
        });
    }
};

exports.createTestPage = (req, res) => {
    res.render('index', {
        activePage: 'create-tests',
        content: 'pages/create-test',
        pageTitle: 'Create Test'
    });
};

exports.viewAllTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.render('index', {
            activePage: 'create-tests',
            content: 'pages/all-tests',
            pageTitle: 'All Tests',
            tests
        });
    } catch (error) {
        console.error('Error loading tests:', error);
        res.render('index', {
            activePage: 'create-tests',
            content: 'pages/all-tests',
            pageTitle: 'All Tests',
            tests: []
        });
    }
};

exports.testBuilder = async (req, res) => {
    try {
        const test = await Test.findById(req.params.testId);
        const questions = await Question.find({ testId: req.params.testId }).sort({ questionNumber: 1 });
        if (!test) return res.status(404).send('Test not found');
        res.render('index', {
            activePage: 'create-tests',
            content: 'pages/test-builder',
            pageTitle: `Edit Test: ${test.title}`,
            test,
            questions
        });
    } catch (error) {
        console.error('Failed to load test:', error);
        res.status(500).send('Failed to load test');
    }
};

exports.takeTestPublic = async (req, res) => {
    try {
        const test = await Test.findOne({ publicLink: req.params.publicLink, isPublished: true });
        if (!test) return res.status(404).send('Test not found or not published');
        const questions = await Question.find({ testId: test._id }).sort({ questionNumber: 1 });
       res.render("pages/take-test", {
        pageTitle: test.title,
        test,
        questions
});
    } catch (error) {
        console.error('Failed to load test:', error);
        res.status(404).send('Test not found');
    }
};

exports.testResults = async (req, res) => {
    try {
        const TestResponse = require('../models/TestResponse');
        const Test = require('../models/Test');
        const Question = require('../models/Question');
        const response = await TestResponse.findById(req.params.responseId);
        if (!response) return res.status(404).send('Response not found');
        const test = await Test.findById(response.testId);
        const questions = await Question.find({ testId: response.testId });
        res.render('index', {
            activePage: 'test-results',
            content: 'pages/test-results',
            pageTitle: 'Test Results',
            response: { ...response.toObject(), test },
            questions
        });
    } catch (error) {
        console.error('Failed to load results:', error);
        res.status(500).send('Failed to load results');
    }
};

exports.renderPage = async (req, res) => {
    const page = req.params.page;
    const title = pageData[page];
    if (!title) return res.redirect('/');

    try {
        if (page === 'reg-student') {
            return res.render('index', { activePage: page, content: 'pages/reg-student', pageTitle: title, success: req.query.success === '1' });
        }

        if (page === 'student-list') {
            const students = await Student.find().sort({ createdAt: -1 });
            return res.render('index', { activePage: page, content: 'pages/student-list', pageTitle: title, students });
        }

        if (page === 'views-seat') {
            const students = await Student.find().sort({ createdAt: 1 });
            const defaultTotalSeats = 60;
            const requestedTotalSeats = parseInt(req.query.totalSeats, 10);
            const selectedTotalSeats = Number.isInteger(requestedTotalSeats) && requestedTotalSeats > 0 ? requestedTotalSeats : defaultTotalSeats;
            const allowedFloors = ['Main Floor', 'First Floor', 'Second Floor'];
            const allowedShifts = ['All Shift', 'Morning', 'Evening', 'Night'];
            const selectedFloor = allowedFloors.includes(req.query.floor) ? req.query.floor : 'Main Floor';
            const selectedShift = allowedShifts.includes(req.query.shift) ? req.query.shift : 'All Shift';
            const totalSeats = Math.max(selectedTotalSeats, students.length);
            const occupiedCount = students.filter(student => student.seatType === 'Occupied' || student.seatType !== 'Reserved').length;
            const reservedCount = students.filter(student => student.seatType === 'Reserved').length;
            const unreversedCount = students.filter(student => student.seatType === 'Unreversed' || student.seatType !== 'Reserved').length;
            const availableCount = totalSeats - students.length;
            const columns = 8;
            const rows = Math.ceil(totalSeats / columns);
            const rowLabels = ['A','B','C','D','E','F','G','H'];
            const seatRows = [];
            const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

            for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
                const row = { letter: rowLabels[rowIndex] || String.fromCharCode(65 + rowIndex), seats: [] };
                for (let col = 1; col <= columns; col++) {
                    const seatNumber = rowIndex * columns + col;
                    if (seatNumber > totalSeats) break;
                    const label = `${row.letter}${col}`;
                    const student = students.find(s => (s.seatNumber || '').toString().trim().toUpperCase() === label.toUpperCase());
                    let status = 'Available';
                    let colorClass = 'available';
                    if (student) {
                        if (student.seatType === 'Reserved') { status = 'Reserved'; colorClass = 'reserved'; }
                        else if (student.seatType === 'Unreversed') { status = 'Unreversed'; colorClass = 'unreversed'; }
                        else { status = 'Occupied'; colorClass = 'occupied'; }
                    }
                    row.seats.push({ label: `${row.letter}${col}`, status, colorClass });
                }
                seatRows.push(row);
            }

            return res.render('index', { activePage: page, content: 'pages/views-seat', pageTitle: title, totalSeats, selectedTotalSeats, occupiedCount, availableCount, reservedCount, unreversedCount, selectedFloor, selectedShift, currentDate, seatRows, columns });
        }

        if (page === 'library-tools') {
            return res.render('index', { activePage: page, content: 'pages/library-tools', pageTitle: title, libraryOperator: true, tools: { whiteboard: { name: 'Whiteboard', icon: 'fa-chalkboard', description: 'Interactive whiteboard for teaching' } } });
        }

        if (page === 'create-tests') {
            const tests = await Test.find();
            return res.render('index', { activePage: page, content: 'pages/create-test', pageTitle: title, tests });
        }

        if (page === 'calculator') {
            return res.render('index', { activePage: page, content: 'pages/calculator', pageTitle: title });
        }

        if (page === 'e-book') {
            return res.render('index', { activePage: page, content: 'pages/E-book', pageTitle: title });
        }

        if (page === 'news') {
            return res.render('index', { activePage: page, content: 'pages/library', pageTitle: title });
        }

        if (page === 'contact') {
            return res.render('index', { activePage: page, content: 'pages/contact', pageTitle: title });
        }

        if (page === 'birthday') {
            // Provide birthdayStudents when rendering via the generic page route
            try {
                const allStudents = await Student.find();
                const today = new Date();
                const currentMonth = today.getMonth() + 1;
                const currentDay = today.getDate();

                const birthdayStudents = allStudents.filter((student) => {
                    if (!student.dateOfBirth) return false;
                    const dob = new Date(student.dateOfBirth);
                    const dobMonth = dob.getMonth() + 1;
                    const dobDay = dob.getDate();
                    return dobMonth === currentMonth && dobDay === currentDay;
                });

                return res.render('index', { activePage: page, content: 'pages/birthday', pageTitle: title, birthdayStudents, currentDate: today.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) });
            } catch (err) {
                console.error('Failed to load birthday students for page route:', err);
                return res.render('index', { activePage: page, content: 'pages/birthday', pageTitle: title, birthdayStudents: [] });
            }

        }

        return res.render('index', { activePage: page, content: 'pages/placeholder', pageTitle: title, pageDescription: `${title} ka content yahan dikhega.` });
    } catch (error) {
        console.error('Render page error:', error);
        return res.render('index', { activePage: page, content: 'pages/placeholder', pageTitle: title, pageDescription: 'Content failed to load.' });
    }
};
