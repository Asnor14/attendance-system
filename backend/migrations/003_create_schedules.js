import { dbRun } from '../database/db.js';

export const up = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_code TEXT NOT NULL,
      subject_name TEXT NOT NULL,
      time_start TEXT NOT NULL,
      time_end TEXT NOT NULL,
      grace_period INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Schedules table created');
};

export const down = async () => {
  await dbRun('DROP TABLE IF EXISTS schedules');
};

