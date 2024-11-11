import express from "express";
import { VerifyMiddleware } from "../../shared/middleware/verfiy.middelware";
import { MedicineService } from "./medicine.service";


const router = express.Router();
const medicineService = new MedicineService()
const verifyMiddleware = new VerifyMiddleware();

//Might not need this exposed in production but doesn't matter too much
router.post("/createMedicine", verifyMiddleware.verifyToken, async (req, res) => {
    try {
    
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
})

//Might want to find a different way to do this as response might be quite large
router.get("/getAllMedicine", verifyMiddleware.verifyToken, async (req, res) => {
    try {
    
    } catch (error: any) {
        res.status(500).json({error: error.message})
    }
})

export default router;