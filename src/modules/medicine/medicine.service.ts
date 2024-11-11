import { MedicineRepository } from "../../database/medicine/medicine.repository";

export class MedicineService {
    constructor(private medicineRepository = new MedicineRepository()){}

    
}