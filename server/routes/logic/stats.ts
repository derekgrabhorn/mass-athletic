export class Statistics {

    getAll(req, res, collection, muscleGroupsCollection, musclesCollection) {
        const today: Date = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        try {
            collection.find({ userId: req.body.userId })
            .toArray()
            .then(async (result) => {
                let groupsData: any = {};
                const ormExercises = ['Bench Press', 'Squat', 'Deadlift'];
                let oneRepMaxData: any = {
                    'Bench Press': {},
                    'Deadlift': {},
                    'Squat': {}
                };
                let totalWorkouts: number = 0;
                let totalDuration: number = 0;
                let workoutsIn90Days: number = 0;
    
                //Format and fill ORM history months object
                let ormMonthsData = await this.processORMMonthsData({}, req.body.ormTimeframe, today);

                //Get array of 'Muscle Groups'
                const muscleGroups = await this.getAllResultNames(muscleGroupsCollection);

                // Get array of 'Muscle Names'
                const muscleNames = await this.getAllResultNames(musclesCollection);
    
                //Setting 'Muscle Groups by Use' data, total workouts
                result.forEach((workout) => {
                    totalWorkouts++;
                    totalDuration += workout.duration;
    
                    if(workout.start > ninetyDaysAgo) {
                        workoutsIn90Days++;
                    }
    
                    workout.exercises.forEach((exercise) => {
                        groupsData[exercise.muscleGroup] = (groupsData[exercise.muscleGroup]+1 || 1);
    
                        exercise.sets.forEach((set) => {
                            if(set.oneRepMax === true && ormExercises.includes(exercise.name)) {
                                oneRepMaxData[exercise.name][Date.parse(workout.start)] = set.weight;
                            }
                        })
                    });
                  });
 
                  //Set data for each ORM exercise
                  ormExercises.forEach((exercise) => {
                    oneRepMaxData[exercise] = this.processOneRepMaxData(exercise, oneRepMaxData, req.body.ormTimeframe, ormMonthsData)
                  });
    
                  //Set averages
                  let averageDurationData = totalDuration/totalWorkouts;
                  let workoutsPerWeekData = workoutsIn90Days / 12.857;
                
                  return res.status(200).json({
                      status: 'success',
                      total: totalWorkouts,
                      totalTime: totalDuration,
                      averageDuration: averageDurationData,
                      workoutsPerWeek: workoutsPerWeekData,
                      muscleGroups: muscleGroups,
                      muscleNames: muscleNames,
                      groupsByUse: groupsData,
                      oneRepMax: oneRepMaxData
                  });
            })
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: `Failed to retrieve statistics: ${err}`,
            })
        }
    }

    // Return all muscle groups in an array: ['CHEST', 'LEGS', 'ARMS'...]
    async getAllResultNames(collection) {
        return collection.find()
        .toArray()
        .then((result) => result.map(item => item.name));
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    async processORMMonthsData(dataObject, months, today) {
        for (let i = 0; i < months.length; i++) {
            dataObject[months[i]] = {};
            dataObject[months[i]].start = Date.parse(months[i]);
            if (months[i+1]) {
                dataObject[months[i]].end = Date.parse(months[i+1]) - 1;
            } else {
                dataObject[months[i]].end = today;
            }
        }

        return dataObject;
    }

    processOneRepMaxData(exercise, oneRepMaxData, months, ormMonthsData) {
        let exerciseORM: number[] = Object.values(oneRepMaxData[exercise]);
        let maxORMWeight: number = Math.max(...exerciseORM);
        let maxORMDate = this.getKeyByValue(oneRepMaxData[exercise], maxORMWeight);
        let maxORMHistory = {};

        let currentHigh;
        months.forEach((month) => {
            maxORMHistory[month] = currentHigh || 0;

          Object.keys(oneRepMaxData[exercise]).forEach((orm) => {
              if (orm > ormMonthsData[month].start && orm < ormMonthsData[month].end) {
                  if (oneRepMaxData[exercise][orm] > maxORMHistory[month]) {
                    maxORMHistory[month] = oneRepMaxData[exercise][orm];
                      currentHigh = oneRepMaxData[exercise][orm];
                  }
              }
          });
        });

        return {
            'ORM_Date': maxORMDate,
            'ORM_Weight' : maxORMWeight,
            'ORM_History' : maxORMHistory
        };
    }

    stats(req, res, collection) {
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
    }

    getExercises(req, res, collection) {
        collection.find({ userId: req.body.userId })
        .toArray((err, result) => {
            if (err) {
                console.log(`Error returning exercises: ${err}`);
            } else {
                return res.status(200).json(result);
            }
        })
    }
}

export default Statistics;