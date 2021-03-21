export interface Coordinates2D {
    x: number;
    y: number;
}

export interface Injury {
    injuryId?: string;
    created?: Date;
    bodyPart: string;
    bodyDiagramCoordinates: Coordinates2D;
    side: string;
    painLevel: string;
    firstOccurrence: Date;
    frequencyOfSymptoms: string;
    cause: string;
    treatment: string;
    triggers: string;
}

export interface User {
    name: string;
    email: string;
    injuries: Injury[];
}