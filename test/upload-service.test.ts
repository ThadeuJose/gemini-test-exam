/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Database,
  IdGenerator,
  ImageRecognitionAPI,
  ImageUploaderAPI,
} from '../src/types';
import { createUploadService } from '../src/upload/upload-service';

const fakeImageApi: ImageRecognitionAPI = {
  execute: jest.fn((image: string) => Promise.resolve(64)),
};

const fakeImageUploaderApi: ImageUploaderAPI = {
  uploadImage: jest.fn((image: string, filename: string) =>
    Promise.resolve('imgUrl'),
  ),
};

const fakeUUID: IdGenerator = {
  createId: jest.fn(() => '00000000-0000-0000-0000-000000000000'),
};

const fakeDatabase: Database = {
  hasEntry: jest.fn(
    (customer_code: string, measure_month: number, measure_type: string) =>
      Promise.resolve(false),
  ),
  addEntry: jest.fn(
    (
      customer_code: string,
      measure_uuid: string,
      measure_datetime: string,
      measure_type: string,
      image_url: string,
    ) => Promise.resolve(),
  ),

  getEntries: jest.fn((customer_code: string, measure_type: string) =>
    Promise.resolve([
      {
        measure_uuid: '',
        measure_datetime: '',
        measure_type: 'WATER',
        has_confirmed: false,
        image_url: '',
      },
    ]),
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
    expect(fakeDatabase.addEntry).toHaveBeenCalledWith(
      'code',
      '00000000-0000-0000-0000-000000000000',
      dateTime,
      'WATER',
      'imgUrl',
    );
  });
});
