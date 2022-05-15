import { Muscle, MuscleGroups } from './enums'

export interface Workout {
    status?: string;
    userId: string;
    name: string;
    start: Date;
    end: Date;
    duration: number;
    exercises: Exercise[];
}

export interface Exercise {
    active?: boolean;
    name: string;
    muscleGroup: MuscleGroups;
    primaryMuscle: Muscle;
    secondaryMuscle: Muscle[];
    sets: Set[];
}

export interface DefaultExercise {
    name: string;
    muscleGroup: MuscleGroups;
    primaryMuscle: Muscle;
    secondaryMuscle: Muscle[];
}

export interface Set {
    status?: string;
    number?: number;
    reps: number;
    weight: number;
    oneRepMax: boolean;
}