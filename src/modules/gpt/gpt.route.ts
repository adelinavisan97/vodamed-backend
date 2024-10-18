import express from "express"
import { VerifyMiddleware } from "../../shared/middleware/verfiy.middelware";
import { GptService } from "./gpt.service";

const router = express.Router();
const gptService = new GptService();
const verifyMiddleware = new VerifyMiddleware();

router.post("/", verifyMiddleware.verifyToken, async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await gptService.getChatGPTResponse(prompt);
    res.status(200).json({ response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router