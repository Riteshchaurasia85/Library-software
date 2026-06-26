const Student = require('../models/Student');

exports.registerStudent = async (req, res) => {
    try {
        // Auto-assign seat label (e.g., A1) if none provided or if provided seat is already taken
        const students = await Student.find().sort({ createdAt: 1 });
        const usedSeats = new Set(students.map(s => (s.seatNumber || '').toString().trim().toUpperCase()));

        const columns = 8; // columns per row (A1..A8)
        const defaultRows = 6; // A..F
        const rows = defaultRows;
        const rowLabels = ['A','B','C','D','E','F','G','H'];

        // Helper to find first free seat
        function findFirstFreeSeat() {
            for (let r = 0; r < rows; r++) {
                const letter = rowLabels[r] || String.fromCharCode(65 + r);
                for (let c = 1; c <= columns; c++) {
                    const label = (letter + c).toUpperCase();
                    if (!usedSeats.has(label)) return label;
                }
            }
            // fallback: next sequential label
            return `Z${students.length + 1}`;
        }

        let seatLabel = req.body.seatNumber ? req.body.seatNumber.toString().trim().toUpperCase() : '';
        if (!seatLabel || usedSeats.has(seatLabel)) {
            seatLabel = findFirstFreeSeat();
        }

        const newStudent = new Student({
            fullName: req.body.fullName,
            date: req.body.date,
            dateOfBirth: req.body.dateOfBirth,
            shift: req.body.shift,
            seatType: req.body.seatType,
            seatNumber: seatLabel,
            fees: req.body.fees,
            mobileNumber: req.body.mobileNumber,
            joiningDate: req.body.joiningDate,
            paymentStatus: req.body.paymentStatus
        });
        await newStudent.save();
        res.redirect('/page/reg-student?success=1');
    } catch (error) {
        console.error('Student save failed:', error);
        res.status(500).send('Unable to save student. Please try again.');
    }
};

exports.getStudentDetails = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.render('index', { activePage: 'dashboard', content: 'pages/student-details', pageTitle: 'Student Details', student });
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).send('Error loading student details');
    }
};

exports.deleteStudentForm = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
    }
};

exports.togglePayment = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        student.paymentStatus = student.paymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
        await student.save();
        res.redirect('/student/' + req.params.id);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).send('Error updating payment status');
    }
};

exports.deleteStudentApi = async (req, res) => {
    try {
        const studentId = req.params.id;

        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting student:", error);

        res.status(500).json({
            success: false,
            message: "Error deleting student"
        });
    }
};

exports.getSeats = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: 1 });

        const defaultTotalSeats = 60;
        const requestedTotalSeats = parseInt(req.query.totalSeats, 10);

        const selectedTotalSeats =
            Number.isInteger(requestedTotalSeats) &&
            requestedTotalSeats > 0
                ? requestedTotalSeats
                : defaultTotalSeats;

        const totalSeats = Math.max(
            selectedTotalSeats,
            students.length
        );

        const occupiedCount = students.filter(
            student =>
                student.seatType === "Occupied" ||
                student.seatType !== "Reserved"
        ).length;

        const reservedCount = students.filter(
            student => student.seatType === "Reserved"
        ).length;

        const unreversedCount = students.filter(
            student =>
                student.seatType === "Unreversed" ||
                student.seatType !== "Reserved"
        ).length;

        const availableCount = totalSeats - students.length;

        const columns = 8;
        const rows = Math.ceil(totalSeats / columns);

        const rowLabels = [
            "A", "B", "C", "D",
            "E", "F", "G", "H"
        ];

        const seatRows = [];

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {

            const row = {
                letter:
                    rowLabels[rowIndex] ||
                    String.fromCharCode(65 + rowIndex),
                seats: []
            };

            for (let col = 1; col <= columns; col++) {

                const seatNumber = rowIndex * columns + col;

                if (seatNumber > totalSeats) break;

                const label = `${row.letter}${col}`;
                const student = students.find(s => (s.seatNumber || '').toString().trim().toUpperCase() === label.toUpperCase());

                let status = "Available";
                let colorClass = "available";

                if (student) {
                    if (student.seatType === "Reserved") {
                        status = "Reserved";
                        colorClass = "reserved";
                    } else if (student.seatType === "Unreversed") {
                        status = "Unreversed";
                        colorClass = "unreversed";
                    } else {
                        status = "Occupied";
                        colorClass = "occupied";
                    }
                }

                row.seats.push({
                    label: `${row.letter}${col}`,
                    status,
                    colorClass
                });
            }

            seatRows.push(row);
        }

        res.json({
            totalSeats,
            occupiedCount,
            availableCount,
            reservedCount,
            unreversedCount,
            seatRows,
            timestamp: new Date()
        });

    } catch (error) {
        console.error("Error fetching seat data:", error);

        res.status(500).json({
            error: "Failed to fetch seat data"
        });
    }
};