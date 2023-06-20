export class WorkoutsLogic {

    async addWorkout(collection, workoutData) {
        try {
            const result = await collection.insertOne(workoutData);

            if (!result) {
                return false;
            }

            return true;
        } catch (err) {
            return false;
        }
    }

    async getWorkouts(collection, userId) {
        try {
            let workoutData = await collection.find({ userId : userId })
            .toArray()
            .then((result) => {
                return {
                    status: 'success',
                    workouts: result
                }
            });

            return workoutData;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default WorkoutsLogic;