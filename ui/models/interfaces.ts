import { Muscle, MuscleGroups } from './enums'

export interface Workout {
    userId: string;
    name: string;
    start: Date;
    end: Date;
    duration: number;
    exercises: Exercise[];
}

export interface Exercise {
    name: string;
    muscleGroup: MuscleGroups;
    primaryMuscle: Muscle;
    secondaryMuscle: Muscle[];
    sets: Set[];
}

export interface Set {
    reps: number;
    weight: number;
    oneRepMax: boolean;
}