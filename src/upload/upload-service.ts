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

  //add entry
  await database.addEntry(customer_code, month, measure_type);

  const filename = `${customer_code}_${measure_type}`;
  const response: UploadResponse = {
    image_url: await uploader.uploadImage(image, filename),
    measure_value: await api.execute(image),
    measure_uuid: idGenerator.createId(),
  };
  return response;
}

function getMonth(dateIso: string): number {
  return DateTime.fromISO(dateIso).month;
}
