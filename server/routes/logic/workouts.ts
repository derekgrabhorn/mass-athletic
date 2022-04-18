export class WorkoutsLogic {

    addWorkout(req, res, collection, db) {
        collection = db.collection(process.env.DATABASE_COLLECTION_WORKOUTS);
        collection.insertOne(req.body)
        .then((result) => {
            return res.status(200).json({
                status: 'success'
            })
        })
        .catch(err => {
            return res.status(500).json({
                status: 'error',
                workouts: `Error saving workout: ${err}`
            });
        });
    }

    getWorkouts(req, res, collection) {
        try {
            collection.find({ userId : req.body.userId })
            .toArray()
            .then((result) => {
                return res.status(200).json({
                    status: 'success',
                    workouts: result
                });
            });
        } catch (err) {
            return res.status(500).json({
                status: 'error',
                workouts: `Error retrieving workouts: ${err}`
            });
        }
    }
}

export default WorkoutsLogic;