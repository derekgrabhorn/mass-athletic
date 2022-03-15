var express = require('express');
var bodyParser = require(`body-parser`);
var mongo = require(`mongoose`);
var route = express.Router();
MongoClient = require('mongodb').MongoClient;
const User = require('./models/user');
require('dotenv').config();

var app = express();

//Database Instance
var db;

app.listen(process.env.PORT, () => {
    MongoClient.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
        if(err) {
            console.log('error', err);
        } else {
        db = client.db(process.env.DATABASE_NAME);
        var collection = db.collection(process.env.DATABASE_COLLECTION_WORKOUTS);
        console.log(`Listening at PORT ${process.env.PORT} and connected to: ` + process.env.DATABASE_NAME );
        }
    });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use((use, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

let workoutSchema = require(`./models/workoutschema`);
let test = new workoutSchema({
    userId: 'Derek Grabhorn',
    workout: 'Workout 1',
    workoutBegin : Date.now(),
    workoutEnd: Date.now()
});

app.post('/api/user/login', (req, res) => {
    collection = db.collection(process.env.DATABASE_COLLECTION_USERS);
    return collection.find({ username: req.body.username, password: req.body.password })
        .toArray()
        .then(result => {
            if (result[0].username === req.body.username && result[0].password === req.body.password) {
                return res.status(200).json({
                    status: 'success',
                    userId: result[0]._id
                });
            }
        })
        .catch(err => res.status(200).json({
            status: 'fail',
            message: `'Login Failed', ${err}`
            })
        );
}); 

app.post('/api/user/addWorkout', (req, res) => {
    collection = db.collection(process.env.DATABASE_COLLECTION_WORKOUTS);
    collection.insertOne(req.body)
    .then((result) => {
        return res.status(200).json({
            status: 'success'
        })
    })
    .catch(err => {
        console.log(err);
    });
});

app.post('/api/user/getWorkouts', (req, res) => {
    collection = db.collection(process.env.DATABASE_COLLECTION_WORKOUTS);
    collection.find({ userId : req.body.userId })
        .toArray()
        .then((result) => {
            return res.status(200).json({
                status: 'success',
                workouts: result
            })
        })
});

app.post('/api/stats/getAll', (req, res) => {
    collection = db.collection(process.env.DATABASE_COLLECTION_WORKOUTS);
    const today = new Date();
    const ninetyDaysAgo = new Date(today);
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    collection.find({ userId: req.body.userId })
        .toArray()
        .then((result) => {
            let groupsData = {};
            let oneRepMaxData = {
                'Bench Press': {},
                'Deadlift': {},
                'Squat': {}
            };
            let totalWorkouts = 0;
            let totalDuration = 0;
            let workoutsIn90Days = 0;
            let months = req.body.ormTimeframe;
            let ormMonthsData = {};

            //Format and fill ORM history months object
            for (let i = 0; i < months.length; i++) {
                ormMonthsData[months[i]] = {};
                ormMonthsData[months[i]].start = Date.parse(months[i]);
                if (months[i+1]) {
                    ormMonthsData[months[i]].end = Date.parse(months[i+1]) - 1;
                } else {
                    ormMonthsData[months[i]].end = Date.parse(today);
                }
            }

            //Setting 'Muscle Groups by Use' data, total workouts
            result.forEach((workout) => {
                totalWorkouts++;
                totalDuration += workout.duration;

                if(Date.parse(workout.start) > ninetyDaysAgo) {
                    workoutsIn90Days++;
                }

                workout.exercises.forEach((exercise) => {
                    groupsData[exercise.muscleGroup] = (groupsData[exercise.muscleGroup]+1 || 1);

                    exercise.sets.forEach((set) => {
                        if(set.oneRepMax === true && ['Bench Press', 'Deadlift', 'Squat'].includes(exercise.name)) {
                            oneRepMaxData[exercise.name][Date.parse(workout.start)] = set.weight;
                        }
                    })
                });
              });

              //Setting ORM data
              function getKeyByValue(object, value) {
                return Object.keys(object).find(key => object[key] === value);
              }

              let benchORMs = Object.values(oneRepMaxData['Bench Press']);
              let maxBenchWeight = Math.max(...benchORMs);
              let maxBenchDate = getKeyByValue(oneRepMaxData['Bench Press'], maxBenchWeight);
              let maxBenchHistory = {};

              let currentHigh;
              months.forEach((month) => {
                maxBenchHistory[month] = currentHigh || 0;

                Object.keys(oneRepMaxData['Bench Press']).forEach((orm) => {
                    if (orm > ormMonthsData[month].start && orm < ormMonthsData[month].end) {
                        if (oneRepMaxData['Bench Press'][orm] > maxBenchHistory[month]) {
                            maxBenchHistory[month] = oneRepMaxData['Bench Press'][orm];
                            currentHigh = oneRepMaxData['Bench Press'][orm];
                        }
                    }
                });
              });

              let maxBenchData = {
                  'BP_ORM_Date': maxBenchDate,
                  'BP_ORM_Weight' : maxBenchWeight,
                  'BP_ORM_History' : maxBenchHistory
              };

              let squatORMs = Object.values(oneRepMaxData['Squat']);
              let maxSquatWeight = Math.max(...squatORMs);
              let maxSquatDate = getKeyByValue(oneRepMaxData['Squat'], maxSquatWeight);
              let maxSquatHistory = {};

              //add logic where if the first month is zero it finds the first ORM before that...

              currentHigh = 0;
              months.forEach((month) => {
                maxSquatHistory[month] = currentHigh || 0;

                Object.keys(oneRepMaxData['Squat']).forEach((orm) => {
                    if (orm > ormMonthsData[month].start && orm < ormMonthsData[month].end) {
                        if (oneRepMaxData['Squat'][orm] > maxSquatHistory[month]) {
                            maxSquatHistory[month] = oneRepMaxData['Squat'][orm];
                            currentHigh = oneRepMaxData['Squat'][orm];
                        }
                    }
                });
              });

              let maxSquatData = {
                  'SQ_ORM_Date': maxSquatDate,
                  'SQ_ORM_Weight': maxSquatWeight,
                  'SQ_ORM_History': maxSquatHistory
              };

              let deadliftORM = Object.values(oneRepMaxData['Deadlift']);
              let maxDeadliftWeight = Math.max(...deadliftORM);
              let maxDeadliftDate = getKeyByValue(oneRepMaxData['Deadlift'], maxDeadliftWeight);
              let maxDeadliftHistory = {};

              currentHigh = 0;
              months.forEach((month) => {
                maxDeadliftHistory[month] = currentHigh || 0;

                Object.keys(oneRepMaxData['Deadlift']).forEach((orm) => {
                    if (orm > ormMonthsData[month].start && orm < ormMonthsData[month].end) {
                        if (oneRepMaxData['Deadlift'][orm] > maxDeadliftHistory[month]) {
                            maxDeadliftHistory[month] = oneRepMaxData['Deadlift'][orm];
                            currentHigh = oneRepMaxData['Deadlift'][orm];
                        }
                    }
                });
              });

              let maxDeadliftData = {
                  'DL_ORM_Date': maxDeadliftDate,
                  'DL_ORM_Weight': maxDeadliftWeight,
                  'DL_ORM_History': maxDeadliftHistory
              };

              //Setting averages
              let averageDurationData = totalDuration/totalWorkouts;
              let workoutsPerWeekData = workoutsIn90Days / 12.857;
            
              return res.status(200).json({
                  status: 'success',
                  total: totalWorkouts,
                  totalTime: totalDuration,
                  averageDuration: averageDurationData,
                  workoutsPerWeek: workoutsPerWeekData,
                  groupsByUse: groupsData,
                  oneRepMax: oneRepMaxData,
                  maxBench: maxBenchData,
                  maxSquat: maxSquatData,
                  maxDeadlift: maxDeadliftData
              });
        })
})

app.post('/api/user/stats', (req, res) => {
    let col= req.body.collection;
    if(col) {
        col.aggregate([
            {"$match":{"associated_user":req.body.username}},
            {"$unwind":"exercise_1"},
            {"$match":{"muscle_group":req.body.muscleGroup_1}},
            {"$unwind":"set_1"},
            {"$match":{"1rm":true}}

        ])
    }
    return collection.find({ username: req.body.username,  })
        .toArray()
        .then(result => {
            if (result[0].username === req.body.username && result[0].password === req.body.password) {
                return res.status(200).json({
                    status: 'success',
                    data: result
                });
            }
        })
        .catch(err => res.status(200).json({
            status: 'fail',
            message: `'Login Failed', ${err}`
            })
        );
});
