import { MedicineModel } from '../../modules/medicine/models/medicine.interface';
import { MedicineDbModel } from './medicineDb.interface';
import { getDb } from '../connection';
import { config } from '../../config';

export class MedicineRepository {
  constructor() {}

  //Could just do this manually not sure we need to add from the web app
  async insertMedicine(medicine: MedicineModel): Promise<string> {
    const medicineDb: MedicineDbModel = {
      name: medicine.name,
      description: medicine.description,
      dosage: medicine.dosage,
      sideEffects: medicine.sideEffects,
      price: medicine.price,
      stock: medicine.stock,
      type: medicine.type,
      image: medicine.image,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      const mongoClient = getDb();
      await mongoClient
        .collection<MedicineDbModel>(config.MedicineCollectionName)
        .insertOne(medicineDb);
      return 'Successfully inserted the medicine';
    } catch (error) {
      console.error({
        message:
          'Failed to add the medicine to the colleciton: ' +
          JSON.stringify(error),
        location: 'medicineRepository.insertMedicine',
      });
      throw new Error();
    }
  }

  async findAllMedicine(): Promise<MedicineDbModel[]> {
    //want to return it as a db model so the frontend has the ids
    try {
      const mongoClient = getDb();
      const allMedicine = await mongoClient
        .collection<MedicineDbModel>(config.MedicineCollectionName)
        .find()
        .toArray();
      return allMedicine || [];
    } catch (error) {
      console.error({
        message: 'Error fetching medicine: ' + JSON.stringify(error),
        location: 'medicineRepository.getAllMedicine',
      });
      throw new Error(`Internal Server Error 500: Error fetching medicine`);
    }
  }

  //Might not need if we cache on the frontend - to decide
  async getMedicine() {}
}
