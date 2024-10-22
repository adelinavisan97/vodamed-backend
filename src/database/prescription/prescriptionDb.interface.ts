import { ObjectId } from "mongodb";

export interface PerscriptionDbModel {
    _id?: ObjectId;
    patient: ObjectId;
    doctor: ObjectId;
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