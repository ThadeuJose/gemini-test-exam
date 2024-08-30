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

describe('POST /upload - double reporter error', () => {
  it('should return double reporter error', async () => {
    const image = imageToBase64('2.jpg');
    const customerCode = 'string';
    const dateTime = '2024-08-29T12:34:56Z';
    const measureType = 'WATER';

    const mockGetEntries = jest
      .spyOn(fakeDatabase, 'hasEntry')
      .mockResolvedValue(Promise.resolve(true));

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

    // Restore the original mock implementation
    mockGetEntries.mockRestore();
  });
});
