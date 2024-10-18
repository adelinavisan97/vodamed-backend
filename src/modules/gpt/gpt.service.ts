import OpenAI from "openai";
import { config } from "../../config";

export class GptService {
  constructor() {}

  // Initialize OpenAI with the API key
  openai = new OpenAI({
    apiKey: config.OpenAPiKey,
  });

  // Method to get a response from ChatGPT
  public getChatGPTResponse = async (prompt: string) => {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      const fullResponse = response.choices[0].message.content;
      console.log(fullResponse);
      return fullResponse;

      // const startIndex = fullResponse!.indexOf("1.");
      // const medsList = fullResponse!
      //   .slice(startIndex)
      //   .split("\n")
      //   .filter(Boolean);
      // return medsList;
    } catch (error) {
      console.error("Error getting response from OpenAI:", error);
      throw error;
    }
  };
}