import { AppError } from '../app-error';
import { HttpStatus } from '../http-status';
import { CustomerResponse, Database, ErrorResponse, Measure } from '../types';

export async function createCustomerService(
  customer_code: string,
  measure_type: string,
  database: Database,
): Promise<CustomerResponse> {
  let measures: Measure[] = [];
  if (measure_type === 'GAS' || measure_type === 'WATER') {
    measures = await database.getEntries(customer_code, measure_type);
  } else {
    measures = await database.getEntries(customer_code, 'ALL');
  }

  if (measures.length === 0) {
    const message: ErrorResponse = {
      error_code: 'MEASURES_NOT_FOUND',
      error_description: 'Nenhuma leitura encontrada',
    };

    throw new AppError(HttpStatus.NOT_FOUND, JSON.stringify(message));
  }

  return {
    customer_code,
    measures,
  };
}
