import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('API Key not found');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const prompt =
  'What is the number being measure in this device ? Please inform in human readeable form and only number and measurement';

export async function execute() {
  const image = {
    inlineData: {
      data: Buffer.from(readFileSync('src/2.jpg')).toString('base64'),
      mimeType: 'image/jpeg',
    },
  };

  const result = await model.generateContent([prompt, image]);
  console.log(result.response.text());
}
