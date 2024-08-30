import {
  Database,
  IdGenerator,
  ImageRecognitionAPI,
  ImageUploaderAPI,
} from '../src/types';
import { createUploadService } from '../src/upload/upload-service';

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

describe('Upload Service', () => {
  it('should have being called with month', async () => {
    const dateTime = '2024-08-29T12:34:56Z';
    const measureType = 'WATER';

    await createUploadService(
      fakeDatabase,
      'code',
      dateTime,
      measureType,
      'image',
      fakeImageUploaderApi,
      fakeImageApi,
      fakeUUID,
    );

    expect(fakeDatabase.hasEntry).toHaveBeenCalledWith('code', 8, 'WATER');
    expect(fakeDatabase.addEntry).toHaveBeenCalledWith('code', 8, 'WATER');
  });
});
