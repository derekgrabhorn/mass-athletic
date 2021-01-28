var express = require('express');
var bodyParser = require(`body-parser`);
var mongo = require(`mongoose`);
var route = express.Router();
MongoClient = require('mongodb').MongoClient;
const User = require('./models/user');
require('dotenv').config();

var app = express();

app.listen(process.env.PORT, () => {
    MongoClient.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
        if(err) {
            console.log('error', err);
        } else {
        var db = client.db(process.env.DATABASE_NAME);
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
    db = client.db(process.env.DATABASE_NAME);
    collection = db.collection(process.env.DATABASE_COLLECTION_USERS);
    return collection.find({ username: req.body.username, password: req.body.password })
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

// var model = mongo.model('users', UsersSchema, 'users')

// app.post('/api/SaveUser', (req, res) => {
//     var mod = new model(req.body);
//     if(req.body.mode == "Save") {
//         mod.save((err, data) => {
//             if(err) {
//                 res.send(err);
//             } else {
//                 res.send({data:'Record has been inserted...'});
//             }
//         });
//     } else {
//         model.findByIdAndUpdate(req.body.id, { name: req.body.name, userId: req.body.userId }, (err, data) => {
//             if(err) {
//                 res.send(err);
//             } else {
//                 res.send({ data:'Record has been updated...'});
//             }
//         });
//     }
// });

// app.post('api/deleteUser', (req, res) => {
//     model.remove({ _id: req.body.id }, (err) => {
//         if(err) {
//             res.send(err);
//         } else {
//             res.send({ data:'Record has been deleted...'});
//         }
//     });
// });

// app.get('/api/getUser', (req, res) => {
//     model.find({}, (err, data) => {
//         if(err) {
//             res.send(err);
//         } else {
//             res.send(data);
//         }
//     });
// });
