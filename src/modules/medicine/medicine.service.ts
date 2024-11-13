import { MedicineRepository } from "../../database/medicine/medicine.repository";
import { MedicineDbModel } from "../../database/medicine/medicineDb.interface";
import { MedicineModel } from "./models/medicine.interface";

export class MedicineService {
    constructor(private medicineRepository = new MedicineRepository()){}

    async createMedicine(medicine: MedicineModel): Promise<string> {
        return await this.medicineRepository.insertMedicine(medicine)
    }

    async getAllMedicine(): Promise<MedicineDbModel[]> {
        return await this.medicineRepository.findAllMedicine()

    }
}