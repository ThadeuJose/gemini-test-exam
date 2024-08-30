import { Database, Measure } from '../types';
import { SQLiteProvider } from './sqlite-provider';

export class SQLiteDatabaseWrapper implements Database {
  async hasEntry(
    customer_code: string,
    measure_month: number,
    measure_type: string,
  ): Promise<boolean> {
    const database = new SQLiteProvider();

    const exists = database.hasEntry(
      customer_code,
      measure_month,
      measure_type,
    );

    database.close();

    return exists;
  }

  async addEntry(
    customer_code: string,
    measure_uuid: string,
    measure_datetime: string,
    measure_type: string,
    image_url: string,
  ) {
    const database = new SQLiteProvider();

    database.addEntry(
      customer_code,
      measure_uuid,
      measure_datetime,
      measure_type,
      image_url,
    );

    database.close();
  }

  async getEntries(
    customer_code: string,
    measure_type: 'GAS' | 'WATER' | 'ALL',
  ): Promise<Measure[]> {
    const database = new SQLiteProvider();
    let measures;
    if (measure_type === 'ALL') {
      measures = database.getAllEntries(customer_code);
    } else {
      measures = database.getEntries(customer_code, measure_type);
    }

    database.close();

    return measures;
  }
}
