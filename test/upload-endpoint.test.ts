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

  it('should validate datetime', async () => {
    const image = imageToBase64('2.jpg');
    const customerCode = 'string';
    const dateTime = '2024-08-29T12:';
    const measureType = 'WATER';

    const response = await request(app).post('/upload').send({
      image: image,
      customer_code: customerCode,
      measure_datetime: dateTime,
      measure_type: measureType,
    });

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error_code: 'INVALID_DATA',
      error_description: 'Invalid datetime',
    });
  });

  it('should validate measure type', async () => {
    const image = imageToBase64('2.jpg');
    const customerCode = 'string';
    const dateTime = '2024-08-29T12:34:56Z';
    const measureType = 'LOG';

    const response = await request(app).post('/upload').send({
      image: image,
      customer_code: customerCode,
      measure_datetime: dateTime,
      measure_type: measureType,
    });

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error_code: 'INVALID_DATA',
      error_description:
        "Invalid enum value. Expected 'WATER' | 'GAS', received 'LOG'",
    });
  });

  it('should validate image', async () => {
    const image = 'data:image/png;base64,...';
    const customerCode = 'string';
    const dateTime = '2024-08-29T12:34:56Z';
    const measureType = 'GAS';

    const response = await request(app).post('/upload').send({
      image: image,
      customer_code: customerCode,
      measure_datetime: dateTime,
      measure_type: measureType,
    });

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error_code: 'INVALID_DATA',
      error_description: 'Invalid Base64 image format',
    });
  });

  it('should validate multiple criteria', async () => {
    const image = 'data:image/png;base64,...';
    const customerCode = 'string';
    const dateTime = '2024-08-29T12:34:56Z';
    const measureType = 'LOG';

    const response = await request(app).post('/upload').send({
      image: image,
      customer_code: customerCode,
      measure_datetime: dateTime,
      measure_type: measureType,
    });

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error_code: 'INVALID_DATA',
      error_description:
        "Invalid enum value. Expected 'WATER' | 'GAS', received 'LOG', Invalid Base64 image format",
    });
  });
});
