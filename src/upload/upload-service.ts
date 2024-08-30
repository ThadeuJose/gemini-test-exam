import { AppError } from '../app-error';
import { HttpStatus } from '../http-status';
import {
  ImageUploaderAPI,
  ImageRecognitionAPI,
  IdGenerator,
  ErrorResponse,
  UploadResponse,
  Database,
} from '../types';
import { DateTime } from 'luxon';

export async function createUploadService(
  database: Database,
  customer_code: string,
  measure_datetime: string,
  measure_type: string,
  image: string,
  uploader: ImageUploaderAPI,
  api: ImageRecognitionAPI,
  idGenerator: IdGenerator,
) {
  const month = getMonth(measure_datetime);
  if (await database.hasEntry(customer_code, month, measure_type)) {
    const message: ErrorResponse = {
      error_code: 'DOUBLE_REPORT',
      error_description: 'Leitura do mês já realizada',
    };

    throw new AppError(HttpStatus.CONFLICT, JSON.stringify(message));
  }

  const filename = `${customer_code}_${measure_type}`;
  const image_url = await uploader.uploadImage(image, filename);
  const measure_value = await api.execute(image);
  const measure_uuid = idGenerator.createId();

  //add entry
  await database.addEntry(
    customer_code,
    measure_uuid,
    measure_datetime,
    measure_type,
    image_url,
  );

  const response: UploadResponse = {
    image_url,
    measure_value,
    measure_uuid,
  };
  return response;
}

function getMonth(dateIso: string): number {
  return DateTime.fromISO(dateIso).month;
}
