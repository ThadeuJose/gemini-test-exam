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
      Promise.resolve(true),
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

describe('POST /upload - double reporter error', () => {
  it('should return double reporter error', async () => {
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

    expect(response.status).toBe(409);
    expect(JSON.parse(response.body)).toEqual({
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada',
    });
  });
});
