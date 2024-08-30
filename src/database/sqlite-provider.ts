import BetterSqlite3 from 'better-sqlite3';

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
        measure_datetime TEXT NOT NULL,
        measure_type TEXT NOT NULL
      )
    `;
    this.db.exec(createTableSQL);
  }

  addEntry(
    customer_code: string,
    measure_month: number,
    measure_type: string,
  ): void {
    const sql =
      'INSERT INTO measurements (customer_code, measure_datetime, measure_type) VALUES (?, ?, ?)';
    const stmt = this.db.prepare(sql);
    stmt.run(customer_code, measure_month, measure_type);
  }

  hasEntry(
    customer_code: string,
    measure_month: number,
    measure_type: string,
  ): boolean {
    const sql =
      'SELECT COUNT(1) AS count FROM measurements WHERE customer_code = ? AND measure_datetime = ? AND measure_type = ?';
    const stmt = this.db.prepare<unknown[], CountResult>(sql);
    const row = stmt.get(customer_code, measure_month, measure_type);
    if (!row) {
      return false;
    }
    return row.count > 0;
  }

  // Close the database connection
  close(): void {}
}
