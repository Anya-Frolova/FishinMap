const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    rank: {
        type: Number,
        default: 0,
        min: 0
    },
    role: {
        type: String,
        enum: ['Regular', 'Expert', 'Admin'],
        default: 'Regular'
    }

}, {
    timestamps: true
});
module.exports = mongoose.model('User', UserSchema);
