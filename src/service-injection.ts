import { GeminiImageRecognitionAPI } from './gemini-image-recognition-api';
import { NodeFileImageUploaderAPI } from './node-file-image-uploader-api';
import { IdGenerator, ImageRecognitionAPI, ImageUploaderAPI } from './types';
import { UUIDService } from './uuid-service';

export function getImageRecognitionAPI(): ImageRecognitionAPI {
  return new GeminiImageRecognitionAPI();
}

export function getIdGenerator(): IdGenerator {
  return new UUIDService();
}

export function getImageUploaderAPI(): ImageUploaderAPI {
  return new NodeFileImageUploaderAPI();
}
