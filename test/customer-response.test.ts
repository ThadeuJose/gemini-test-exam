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

describe('GET /customer', () => {
  it("should require all entries if isn't pass parameter", async () => {
    const response = await request(app).get('/customer_code/list');

    expect(response.status).toBe(200);
    expect(fakeDatabase.getEntries).toHaveBeenCalledWith(
      'customer_code',
      'ALL',
    );
  });

  it('should pass parameter case insensitive', async () => {
    const response = await request(app).get(
      '/customer_code/list?measure_type=water',
    );

    expect(response.status).toBe(200);
    expect(fakeDatabase.getEntries).toHaveBeenCalledWith(
      'customer_code',
      'WATER',
    );
  });
});
