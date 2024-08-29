import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { ImageRecognitionAPI } from './types';

export class GeminiImageRecognitionAPI implements ImageRecognitionAPI {
  genAI: GoogleGenerativeAI;
  model: GenerativeModel;
  prompt: string;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('API Key not found');
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    this.prompt =
      'What is the number being measure in this device ? Please inform in human readeable form and only number';
  }

  async execute() {
    const image = {
      inlineData: {
        data: Buffer.from(readFileSync('src/2.jpg')).toString('base64'),
        mimeType: 'image/jpeg',
      },
    };

    const result = await this.model.generateContent([this.prompt, image]);
    console.log(result.response.text());
  }
}
