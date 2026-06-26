const Student = require('../models/Student');

exports.calculator = (req, res) => {
    try {
        const { num1, num2, operation } = req.body;
        if (num1 === undefined || num2 === undefined || !operation) return res.status(400).json({ success: false, message: 'Invalid input' });
        const a = parseFloat(num1);
        const b = parseFloat(num2);
        if (isNaN(a) || isNaN(b)) return res.status(400).json({ success: false, message: 'Numbers must be valid' });
        let result;
        switch (operation) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': if (b === 0) return res.status(400).json({ success: false, message: 'Cannot divide by zero' }); result = a / b; break;
            default: return res.status(400).json({ success: false, message: 'Invalid operation' });
        }
        res.json({ success: true, result });
    } catch (error) {
        console.error('Calculator error:', error);
        res.status(500).json({ success: false, message: 'Calculation failed', error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const deletedStudent = await Student.findByIdAndDelete(studentId);
        if (!deletedStudent) return res.status(404).json({ success: false, message: 'Student not found' });
        res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ success: false, message: 'Error deleting student' });
    }
};

exports.seats = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: 1 });
        const defaultTotalSeats = 60;
        const requestedTotalSeats = parseInt(req.query.totalSeats, 10);
        const selectedTotalSeats = Number.isInteger(requestedTotalSeats) && requestedTotalSeats > 0 ? requestedTotalSeats : defaultTotalSeats;
        const totalSeats = Math.max(selectedTotalSeats, students.length);
        const occupiedCount = students.filter(student => student.seatType === 'Occupied' || student.seatType !== 'Reserved').length;
        const reservedCount = students.filter(student => student.seatType === 'Reserved').length;
        const unreversedCount = students.filter(student => student.seatType === 'Unreversed' || student.seatType !== 'Reserved').length;
        const availableCount = totalSeats - students.length;
        const columns = 8;
        const rows = Math.ceil(totalSeats / columns);
        const rowLabels = ['A','B','C','D','E','F','G','H'];
        const seatRows = [];

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

        res.json({ totalSeats, occupiedCount, availableCount, reservedCount, unreversedCount, seatRows, timestamp: new Date() });
    } catch (error) {
        console.error('Error fetching seat data:', error);
        res.status(500).json({ error: 'Failed to fetch seat data' });
    }
};
