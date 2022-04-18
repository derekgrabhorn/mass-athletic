import mongo from 'mongoose';

let workoutSchema = new mongo.Schema({
    userId: {type: String },
    workout: {type: String },
    workoutBegin : {type: Date },
    workoutEnd: {type: Date }
},{ versionKey: false });

export default mongo.model('Workout', workoutSchema);