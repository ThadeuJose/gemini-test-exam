const fakeApi: ImageRecognitionAPI = {
  execute: jest.fn(),
};

import request from 'supertest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { app } from '../src/app';
import { ImageRecognitionAPI } from '../src/types';

jest.mock('../src/service-injection', () => ({
  getImageRecognitionAPI: () => fakeApi,
}));

function imageToBase64(filename: string) {
  const imagePath = join(__dirname, 'test-image', filename);
  const file = readFileSync(imagePath);
  return `data:image/png;base64,${file.toString('base64')}`;
}

describe('POST /upload', () => {
  it('should accept request', async () => {
    const image = imageToBase64('2.jpg');
    const customerCode = 'string';
    const dateTime = '2024-08-29T12:34:56Z';
    const measureType = 'WATER';

    const response = await request(app).post('/upload').send({
      image: image,
      customer_code: customerCode,
      measure_datetime: dateTime,
      measure_type: measureType,
    });

    expect(response.status).toBe(200);
  });
});
