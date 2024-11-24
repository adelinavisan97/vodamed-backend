import { ObjectId } from "mongodb";
 
export interface PerscriptionDbModel {
   
    patient: ObjectId;
    doctor: ObjectId;
    medicines: {
        medicine: ObjectId;
        dosage: string;
        quantity: number;
    }[];
    prescriptionDate: Date;
    notes?: string;
    
}