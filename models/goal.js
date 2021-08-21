const mongoose = require('mongoose');
const Constants = require('./constants');

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: Constants.GOAL_MIN_LENGTH,
        maxlength: Constants.GOAL_MAX_LENGTH,
        trim: true,
    },
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports.Goal = Goal;
module.exports.goalSchema = goalSchema;