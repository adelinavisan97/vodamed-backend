import { ObjectId } from "mongodb";

//Would probably wannt to split into request and response objects if we were doing this properly
export interface PerscriptionModel {
    patient: ObjectId; //might need to swap this to email when the frontend makes the request MIGHT NEED TO BE STRING NOT SURE HOW FRONTEND WILL BE PASSING
    doctor: ObjectId; //might need to swap this to email
    medicines: {
        medicine: ObjectId; //Not sure how Object IDs are passed in either, this might just need to be string
        dosage: string;
        quantity: number;
    }[];
    prescriptionDate: Date; //Not sure this will be interpreted as Date
    notes?: string;
    emailNotification?: boolean;
    createdAt?: Date; //Optional as we don't requrie this from the frontend but we can return it
    updatedAt?: Date;
}