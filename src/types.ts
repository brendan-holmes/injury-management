export interface Coordinates2D {
    x: number;
    y: number;
}

export interface Injury {
    injuryId?: string;
    bodyPart: string;
    bodyDiagramCoordinates: Coordinates2D;
    created?: Date;
}

export interface User {
    name: string;
    email: string;
    injuries: Injury[];
}