const mongoose = require('mongoose');
const { schemaOptions } = require('./modelOptions');

const labelSchema = new mongoose.Schema({
    labelId: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
}, schemaOptions);

module.exports = mongoose.model('Label', labelSchema);  
