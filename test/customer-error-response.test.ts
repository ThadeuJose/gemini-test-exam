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

describe('GET /customer - error', () => {
  it('should return invalid measure type', async () => {
    const response = await request(app).get('/string/list?measure_type=LOG');

    expect(response.status).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitida',
    });
  });

  it('should return measures not found', async () => {
    const mockGetEntries = jest
      .spyOn(fakeDatabase, 'getEntries')
      .mockResolvedValue(Promise.resolve([]));

    const response = await request(app).get('/string/list');

    expect(response.status).toBe(404);
    expect(JSON.parse(response.body)).toEqual({
      error_code: 'MEASURES_NOT_FOUND',
      error_description: 'Nenhuma leitura encontrada',
    });

    // Restore the original mock implementation
    mockGetEntries.mockRestore();
  });
});
