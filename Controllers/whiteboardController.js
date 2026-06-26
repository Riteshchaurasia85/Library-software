const Whiteboard = require('../models/Whiteboard');

exports.saveWhiteboard = async (req, res) => {
    try {
        const { title, imageData, drawingData, description, tags } = req.body;
        const whiteboard = new Whiteboard({
            title: title || 'Untitled Whiteboard',
            description: description || '',
            imageData,
            drawingData,
            createdBy: 'Anonymous',
            tags: tags || [],
            isPublic: false
        });
        await whiteboard.save();
        res.json({ success: true, message: 'Whiteboard saved successfully', id: whiteboard._id });
    } catch (error) {
        console.error('Error saving whiteboard:', error);
        res.status(500).json({ success: false, message: 'Error saving whiteboard', error: error.message });
    }
};

exports.listWhiteboards = async (req, res) => {
    try {
        const whiteboards = await Whiteboard.find({}, 'title createdAt updatedAt _id').sort({ updatedAt: -1 });
        res.json({ success: true, whiteboards });
    } catch (error) {
        console.error('Error fetching whiteboards:', error);
        res.status(500).json({ success: false, message: 'Error fetching whiteboards' });
    }
};

exports.getWhiteboard = async (req, res) => {
    try {
        const whiteboard = await Whiteboard.findById(req.params.id);
        if (!whiteboard) return res.status(404).json({ success: false, message: 'Whiteboard not found' });
        res.json({ success: true, whiteboard });
    } catch (error) {
        console.error('Error fetching whiteboard:', error);
        res.status(500).json({ success: false, message: 'Error fetching whiteboard' });
    }
};

exports.deleteWhiteboard = async (req, res) => {
    try {
        await Whiteboard.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Whiteboard deleted successfully' });
    } catch (error) {
        console.error('Error deleting whiteboard:', error);
        res.status(500).json({ success: false, message: 'Error deleting whiteboard' });
    }
};
