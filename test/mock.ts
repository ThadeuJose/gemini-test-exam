/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ImageRecognitionAPI,
  ImageUploaderAPI,
  IdGenerator,
  Database,
} from '../src/types';

export const fakeImageApi: ImageRecognitionAPI = {
  execute: jest.fn((image: string) => Promise.resolve(64)),
};

export const fakeImageUploaderApi: ImageUploaderAPI = {
  uploadImage: jest.fn((image: string, filename: string) =>
    Promise.resolve('imgUrl'),
  ),
};

export const fakeUUID: IdGenerator = {
  createId: jest.fn(() => '00000000-0000-0000-0000-000000000000'),
};

export const fakeDatabase: Database = {
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
