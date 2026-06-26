const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    result:{
        type:String
    }
});

module.exports = mongoose.model('Calculation', calculationSchema);