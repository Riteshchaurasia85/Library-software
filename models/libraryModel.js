const mongoose = require('mongoose');

const librarySchema =
new mongoose.Schema({

    title:String,

    type:String,

    time:String,

    icon:String,

    link:String

});

module.exports =
mongoose.model(
'Library',
librarySchema
);