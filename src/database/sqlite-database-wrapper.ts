import { Database } from '../types';
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
    measure_month: number,
    measure_type: string,
  ) {
    const database = new SQLiteProvider();

    database.addEntry(customer_code, measure_month, measure_type);

    database.close();
  }
}
