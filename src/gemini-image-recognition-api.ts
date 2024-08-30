import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { ImageRecognitionAPI } from './types';
import { extractMimeTypeAndData } from './util';

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

  async execute(image: string): Promise<number> {
    const { data, mimeType } = extractMimeTypeAndData(image);
    const model = {
      inlineData: { data, mimeType },
    };

    const result = await this.model.generateContent([this.prompt, model]);
    return parseInt(result.response.text(), 10);
  }
}
