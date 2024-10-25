import { ObjectId } from "mongodb";

export interface PerscriptionModel {
    patient: ObjectId; //might need to swap this to email when the frontend makes the request
    doctor: ObjectId; //might need to swap this to email
    medicines: {
        medicine: ObjectId;
        dosage: string;
        quantity: number;
    }[];
    prescriptionDate: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}