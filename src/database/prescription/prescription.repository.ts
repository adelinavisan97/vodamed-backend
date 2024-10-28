import { ObjectId } from 'mongodb';
import { UserRepository } from './../user/user.repository';
import { PerscriptionModel } from "../../modules/users/models/perscription.interface";
import { getDb } from '../connection';
import { PerscriptionDbModel } from './prescriptionDb.interface';
import { config } from '../../config';

export class PrescriptionRepository {
    constructor(private userRepository = new UserRepository()){
    }

    //Using user email as I saw it was the identifier in the original code, but we can swap to id if needed
    async insertPrescription(prescription: PerscriptionModel): Promise<string>{ //might need to pass emails in here for fetching or fetch from service
        //Could add a check to make sure the provided doctor ID is actually a doctor
        const prescriptionDb: PerscriptionDbModel = {
            patient: new ObjectId(prescription.patient), //might need editing if we are passing emails instead, will need to fecth userId from email
            doctor: new ObjectId(prescription.doctor), //only doctors will be inserting, but might also be passed in as an email so will want to fetch an ID
            medicines: prescription.medicines.map(item => ({
                ...item,
                medicine: new ObjectId(item.medicine)
            })), //Might need to change this to convert the object ID stored inside
            prescriptionDate: prescription.prescriptionDate,
            notes: prescription.notes,
            createdAt: new Date(), //as before might want to set this in the backend rather than passing it
            updatedAt: new Date(),
        }
        try{
            const mongoClient = getDb();
            await mongoClient
                .collection<PerscriptionDbModel>(config.PrescriptionCollectionName)
                .insertOne(prescriptionDb)
            return "Success"
        }catch(error){
            console.error({
                message: "Failed to create prescription record",
                location:"prescriptionRepository.insertPrescription"
            })
            throw new Error()
        }
    }

    //Might just be able to return as DbModel honestly
    private toPrescriptionModel(prescriptions: PerscriptionDbModel[]): PerscriptionModel[]{
        const newPrescriptions: PerscriptionModel[] = prescriptions.map(prescription => ({
            patient: prescription.patient,
            doctor: prescription.doctor, 
            medicines: prescription.medicines,
            prescriptionDate: prescription.prescriptionDate,
            notes: prescription.notes,
            createdAt: prescription.createdAt,
            updatedAt: prescription.updatedAt,
        }))
        return newPrescriptions
    }

    async getUserPrescriptions(userEmail: string): Promise<PerscriptionModel[] | undefined>{
        const userId = await this.userRepository.getUserId(userEmail) //Can probably extract to the service and pass an id
        try{
            const mongoClient = getDb();
            const userPrescriptions: PerscriptionDbModel[] = await mongoClient
                .collection<PerscriptionDbModel>(config.PrescriptionCollectionName)
                .find({patient: userId})
                .toArray()
            if(userPrescriptions){
                return this.toPrescriptionModel(userPrescriptions)
            }else{
                console.log("No prescriptions found for user")
                return undefined
            }
        }catch (error) {
            console.error({
                message: "Error fetching user prescriptions",
                location: "prescriptionRepository.getUserPrescriptions"
            })
        }   
    }
}