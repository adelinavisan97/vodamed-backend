import express from 'express';
import { VerifyMiddleware } from '../../shared/middleware/verfiy.middelware';
import { MedicineService } from './medicine.service';

const router = express.Router();
const medicineService = new MedicineService();
const verifyMiddleware = new VerifyMiddleware();

//Might not need this exposed in production but doesn't matter too much
//Can remove verify middleware when using postman or generate a token to add to the request
router.post(
  '/createMedicine',
  verifyMiddleware.verifyToken,
  async (req, res) => {
    try {
      const response = await medicineService.createMedicine(req.body);
      return res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Might want to find a different way to do this as response might be quite large
router.get(
  '/getAllMedicine',
  verifyMiddleware.verifyToken,
  async (req, res) => {
    try {
      const medicines = await medicineService.getAllMedicine();
      return res.status(200).json(medicines);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
