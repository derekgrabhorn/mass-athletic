import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export class Database {

    private static instance: Database;

    private database;
    public workoutCollection;
    public usersCollection;
    public exercisesCollection;
    public muscleGroupsCollection;
    public musclesCollection;

    static getInstance(): Database {
        if (!this.instance) {
            Database.instance = new Database();
        }

        return this.instance;
    }

    private constructor() {
        MongoClient.connect(process.env.CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (err, client) => {
            if (err) {
                console.log('Error: ', err);
            } else {
                this.database = client.db(process.env.DATABASE_NAME);
                this.workoutCollection = this.database.collection(process.env.DATABASE_COLLECTION_WORKOUTS);
                this.usersCollection = this.database.collection(process.env.DATABASE_COLLECTION_USERS);
                this.exercisesCollection = this.database.collection(process.env.DATABASE_COLLECTION_EXERCISES);
                this.muscleGroupsCollection = this.database.collection(process.env.DATABASE_COLLECTION_MUSCLE_GROUPS);
                this.musclesCollection = this.database.collection(process.env.DATABASE_COLLECTION_MUSCLE_NAMES)
                console.log(`Connected to: ` + process.env.DATABASE_NAME );
            }
        });
    }
}

export default Database;