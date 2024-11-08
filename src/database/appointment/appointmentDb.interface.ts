import { ObjectId } from "mongodb";

export interface AppointmentDbModel {
    _id?: ObjectId;
    patient: ObjectId; // Reference to the User (patient)
    doctor: ObjectId; // Reference to the User (doctor) - doctors can be admin
    appointmentDate: Date;
    reason: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}