let mongo = require(`mongoose`);

let workoutSchema = new mongo.Schema({
    userId: {type: String },
    workout: {type: String },
    workoutBegin : {type: Date },
    workoutEnd: {type: Date }
},{ versionKey: false });

module.exports = mongo.model('Workout', workoutSchema);