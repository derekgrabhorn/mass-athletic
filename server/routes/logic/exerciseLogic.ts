export class ExerciseLogic {

    async saveExercise(collection, exerciseData) {
        try {
            const data = {
                userId: exerciseData.userId,
                name: exerciseData.data.name,
                muscleGroup: exerciseData.data.group,
                primaryMuscle: exerciseData.data.primaryMuscles,
                secondaryMuscle: exerciseData.data.secondaryMuscles
            }

            const result = await collection.insertOne(data);

            if (!result) {
                return false;
            }

            return true;
        } catch (err) {
            return false;
        }
    }
}

export default ExerciseLogic;