import { GoogleGenAI, Type } from '@google/genai';
import { Level, EvaluationResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(jsonString: string): T => {
  try {
    const cleanedString = jsonString.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanedString);
  } catch (error) {
    console.error("Failed to parse JSON response:", jsonString);
    throw new Error("Invalid JSON response from API.");
  }
};

export const generateLevel = async (levelNumber: number, topic: string): Promise<Level> => {
  const prompt = `
    You are an AI Guru, a wise sage from ancient India, teaching a young 'Yodha' (warrior) the art of Python programming.
    Your student is roughly an 8th-grade student, so your language must be very simple, clear, and encouraging.
    Your task is to create a lesson for Mission ${levelNumber + 1}, focusing on the topic: '${topic}'.
    
    IMPORTANT: Use analogies from Indian culture, epics (like Ramayana, Mahabharata), folklore, or simple village life. For example, a variable is a 'potli' (pouch) to store something. A list is a 'mala' (garland) of flowers.
    HOWEVER, all UI text (like titles, challenges, hints) must be in simple, plain English. The Indian theme should be in the storytelling and analogies, not in the core instructions.

    Your response MUST be a valid JSON object without any markdown formatting.

    The JSON object must have this structure:
    - "title": A mission title in simple English, using the theme as flavor. Example: "Variables: The Naming Ceremony".
    - "story": A short, engaging story (2-3 sentences) setting the scene for the Yodha's mission.
    - "explanation": A very simple explanation of the concept using a relatable Indian analogy, but with technical terms in English.
    - "example": A small, complete Python code snippet. This code MUST be heavily commented. Add a comment (#) to EVERY line explaining what it does in simple terms.
    - "challenge": A clear, simple coding task for the Yodha, continuing the story. Must be in plain English.
    - "solution": The correct, complete Python code to solve the challenge.
    - "hint": A small, encouraging hint in plain English.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          story: { type: Type.STRING },
          explanation: { type: Type.STRING },
          example: { 
            type: Type.STRING,
            description: "A heavily commented Python code example. Every line should have a '#' comment explaining its purpose."
          },
          challenge: { type: Type.STRING },
          solution: { type: Type.STRING },
          hint: { type: Type.STRING },
        },
        required: ['title', 'story', 'explanation', 'example', 'challenge', 'solution', 'hint'],
      },
    },
  });

  return parseJsonResponse<Level>(response.text);
};

export const generateNewExample = async (topic: string, oldExample: string): Promise<{ example: string }> => {
  const prompt = `
    You are an AI Guru helping a young Yodha who is confused.
    The topic of the lesson is: '${topic}'.
    The Yodha did not understand this example:
    \`\`\`python
    ${oldExample}
    \`\`\`
    Your task is to provide a NEW, DIFFERENT, and even SIMPLER example for the same topic.
    Use another analogy from Indian culture or folklore.
    The new example must be a complete, runnable Python snippet.
    It MUST be heavily commented. Add a comment to EVERY single line explaining what it does in the simplest possible terms.

    Your response MUST be a valid JSON object without any markdown formatting, containing only the 'example' key.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          example: { 
            type: Type.STRING,
            description: "A new, simpler, heavily commented Python code example. Every line should have a '#' comment."
          },
        },
        required: ['example'],
      },
    },
  });

  return parseJsonResponse<{ example: string }>(response.text);
};

export const evaluateCode = async (userCode: string, solutionCode: string, challenge: string): Promise<EvaluationResult> => {
  const prompt = `
    You are a wise and encouraging AI Guru reviewing code submitted by your student, a young Yodha.
    The Yodha is trying to solve this challenge: '${challenge}'.
    The ideal solution is:
    \`\`\`python
    ${solutionCode}
    \`\`\`
    The Yodha submitted this code:
    \`\`\`python
    ${userCode}
    \`\`\`
    Analyze the Yodha's code. Does it correctly solve the challenge?
    Your response must be a valid JSON object. Do not include any markdown formatting like \`\`\`json.
    - If the code is correct, 'isCorrect' must be true, and 'feedback' should be a short, congratulatory message like "Well done, Yodha! Your logic is sharp as a warrior's sword."
    - If the code is incorrect, 'isCorrect' must be false, and 'feedback' should be a kind, encouraging message explaining the mistake in simple terms. Avoid giving the direct answer. For example, "A noble attempt, young warrior. It seems you have forgotten the correct way to..."
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING },
        },
        required: ['isCorrect', 'feedback'],
      },
    },
  });
  
  return parseJsonResponse<EvaluationResult>(response.text);
};