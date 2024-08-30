const fakeImageApi: ImageRecognitionAPI = {
  execute: jest.fn(),
};

const fakeImageUploaderApi: ImageUploaderAPI = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadImage: jest.fn((image: string, filename: string) =>
    Promise.resolve('imgUrl'),
  ),
};

const fakeUUID: IdGenerator = {
  createId: jest.fn(() => '00000000-0000-0000-0000-000000000000'),
};

const fakeDatabase: Database = {
  hasEntry: jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (customer_code: string, measure_month: number, measure_type: string) =>
      Promise.resolve(false),
  ),
  addEntry: jest.fn(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (customer_code: string, measure_month: number, measure_type: string) =>
      Promise.resolve(),
  ),
};

import request from 'supertest';
import { app } from '../src/app';
import {
  ImageRecognitionAPI,
  IdGenerator,
  ImageUploaderAPI,
  Database,
} from '../src/types';
import { imageToBase64 } from './util';

jest.mock('../src/service-injection', () => ({
  getImageRecognitionAPI: () => fakeImageApi,
  getIdGenerator: () => fakeUUID,
  getImageUploaderAPI: () => fakeImageUploaderApi,
  getDatabase: () => fakeDatabase,
}));

describe('POST /upload - validate parameters', () => {
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
