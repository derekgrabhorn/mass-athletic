export class Statistics {

    getAll(req, res, collection) {
        const today: Date = new Date();
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        try {
            collection.find({ userId: req.body.userId })
            .toArray()
            .then((result) => {
                let groupsData: any = {};
                let oneRepMaxData: any = {
                    'Bench Press': {},
                    'Deadlift': {},
                    'Squat': {}
                };
                let totalWorkouts: number = 0;
                let totalDuration: number = 0;
                let workoutsIn90Days: number = 0;
                let months = req.body.ormTimeframe;
                let ormMonthsData: any = {};
    
                //Format and fill ORM history months object
                for (let i = 0; i < months.length; i++) {
                    ormMonthsData[months[i]] = {};
                    ormMonthsData[months[i]].start = Date.parse(months[i]);
                    if (months[i+1]) {
                        ormMonthsData[months[i]].end = Date.parse(months[i+1]) - 1;
                    } else {
                        ormMonthsData[months[i]].end = today;
                    }
                }
    
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
    
                  let benchORMs: number[] = Object.values(oneRepMaxData['Bench Press']);
                  let maxBenchWeight: number = Math.max(...benchORMs);
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
    
                  let squatORMs: number[] = Object.values(oneRepMaxData['Squat']);
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
    
                  let deadliftORM: number[] = Object.values(oneRepMaxData['Deadlift']);
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
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                message: `Failed to retrieve statistics: ${err}`,
            })
        }
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
}

export default Statistics;