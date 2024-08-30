import {
  fakeImageApi,
  fakeUUID,
  fakeImageUploaderApi,
  fakeDatabase,
} from './mock';

jest.mock('../src/service-injection', () => ({
  getImageRecognitionAPI: () => fakeImageApi,
  getIdGenerator: () => fakeUUID,
  getImageUploaderAPI: () => fakeImageUploaderApi,
  getDatabase: () => fakeDatabase,
}));

import request from 'supertest';
import { app } from '../src/app';
import { imageToBase64 } from './util';

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
