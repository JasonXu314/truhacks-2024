export interface IField {
    id: number;
    name: string;
    subjects: ISubject[];
}

export interface ISubject {
    id: number;
    fieldId: number;
    name: string;
}