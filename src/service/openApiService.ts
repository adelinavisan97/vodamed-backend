import OpenAI from "openai";
import { config } from "../config";

const openai = new OpenAI({
  apiKey: config.OpenAPiKey,
});

export const getChatGPTResponse = async (prompt: string) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    const fullResponse = response.choices[0].message.content;
    console.log(fullResponse)
    return fullResponse;
    // Remove the introductory sentence and return only the list
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
