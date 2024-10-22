import { ObjectId } from "mongodb";

export interface MedicineDbModel {
    _id?: ObjectId;
    name: string;
    description?: string;
    dosage: string;
    sideEffects?: string[];
    price: number;
    stock: number;
    type: 'prescription' | 'over-the-counter'; // If it is prescription it cannot be bought
    image?: string; //Base 64 string, might need to think a bit more about this, can be stored as URL
    createdAt: Date;
    updatedAt: Date;
}