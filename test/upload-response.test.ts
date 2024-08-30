const fakeImageApi: ImageRecognitionAPI = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute: jest.fn((image: string) => Promise.resolve(64)),
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

import request from 'supertest';
import { app } from '../src/app';
import {
  ImageRecognitionAPI,
  IdGenerator,
  ImageUploaderAPI,
} from '../src/types';
import { imageToBase64 } from './util';

jest.mock('../src/service-injection', () => ({
  getImageRecognitionAPI: () => fakeImageApi,
  getIdGenerator: () => fakeUUID,
  getImageUploaderAPI: () => fakeImageUploaderApi,
}));

describe('POST /upload - validate body', () => {
  it('should return correct UUID', async () => {
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
    const expectUUID = '00000000-0000-0000-0000-000000000000';

    expect(response.body).toHaveProperty('measure_uuid', expectUUID);
  });

  it('should return correct measurement', async () => {
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
    expect(response.body).toHaveProperty('measure_value', 64);
  });

  it('should return correct image url', async () => {
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
    expect(response.body).toHaveProperty('image_url', 'imgUrl');
  });
});
