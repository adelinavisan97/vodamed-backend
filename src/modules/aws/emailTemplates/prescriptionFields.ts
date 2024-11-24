import { ObjectId } from 'mongodb';

export interface PerscriptionCreationFields {
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
