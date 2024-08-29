import { GeminiImageRecognitionAPI } from './gemini-image-recognition-api';
import { ImageRecognitionAPI } from './types';

export function getImageRecognitionAPI(): ImageRecognitionAPI {
  return new GeminiImageRecognitionAPI();
}
