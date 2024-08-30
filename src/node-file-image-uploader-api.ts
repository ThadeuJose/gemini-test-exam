import { ImageUploaderAPI } from './types';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { extractMimeTypeAndData } from './util';

export class NodeFileImageUploaderAPI implements ImageUploaderAPI {
  async uploadImage(image: string, filename: string): Promise<string> {
    const { data, extension } = extractMimeTypeAndData(image);

    const buffer = Buffer.from(data, 'base64');

    const fullFilename = `${filename}.${extension}`;

    const path = join(__dirname, 'images', fullFilename);

    await writeFile(path, buffer);

    return `http://localhost:3000/images/${fullFilename}`;
  }
}
