import BetterSqlite3 from 'better-sqlite3';
import { Measure } from '../types';

interface CountResult {
  count: number;
}

export class SQLiteProvider {
  private db: BetterSqlite3.Database;

  constructor() {
    this.db = new BetterSqlite3('./src/database/dev.db', {
      verbose: console.log,
    });
    this.initialize();
  }

  // Initialize the database by creating the necessary table
  initialize(): void {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_code TEXT NOT NULL,
        measure_uuid TEXT NOT NULL,
        measure_datetime TEXT NOT NULL,
        measure_type TEXT NOT NULL,
        has_confirmed INTEGER NOT NULL,
        image_url TEXT NOT NULL
      )
    `;
    this.db.exec(createTableSQL);
  }

  addEntry(
    customer_code: string,
    measure_uuid: string,
    measure_datetime: string,
    measure_type: string,
    image_url: string,
  ): void {
    const sql =
      'INSERT INTO measurements (customer_code, measure_uuid, measure_datetime, measure_type, has_confirmed, image_url) VALUES (?, ?, ?, ?, ?, ?)';
    const stmt = this.db.prepare(sql);
    stmt.run(
      customer_code,
      measure_uuid,
      measure_datetime,
      measure_type,
      0,
      image_url,
    );
  }

  hasEntry(
    customer_code: string,
    measure_month: number,
    measure_type: string,
  ): boolean {
    const sql = `SELECT COUNT(1) AS count
     FROM measurements
     WHERE customer_code = ?
       AND strftime('%m', measure_datetime) = ?
       AND measure_type = ?`;
    const monthStr = measure_month.toString().padStart(2, '0');
    const stmt = this.db.prepare<unknown[], CountResult>(sql);
    const row = stmt.get(customer_code, monthStr, measure_type);
    if (!row) {
      return false;
    }
    return row.count > 0;
  }

  getAllEntries(customer_code: string): Measure[] {
    const sql = 'SELECT * FROM measurements WHERE customer_code = ?';
    const stmt = this.db.prepare<unknown[], Measure>(sql);
    const rows = stmt.all(customer_code);
    return rows;
  }

  getEntries(customer_code: string, measure_type: string): Measure[] {
    const sql =
      'SELECT * FROM measurements WHERE customer_code = ? AND measure_type = ?';
    const stmt = this.db.prepare<unknown[], Measure>(sql);
    const rows = stmt.all(customer_code, measure_type);
    return rows;
  }

  // Close the database connection
  close(): void {
    this.db.close();
  }
}
