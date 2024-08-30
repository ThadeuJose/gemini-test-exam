import { readFileSync } from 'fs';
import { join } from 'path';

export function imageToBase64(filename: string) {
  const imagePath = join(__dirname, 'test-image', filename);
  const file = readFileSync(imagePath);
  return `data:image/png;base64,${file.toString('base64')}`;
}
