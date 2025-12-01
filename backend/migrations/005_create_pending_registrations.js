import { dbRun } from '../database/db.js';

export const up = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS pending_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      given_name TEXT NOT NULL,
      middle_name TEXT,
      surname TEXT NOT NULL,
      student_id TEXT NOT NULL,
      course TEXT NOT NULL,
      date_enrolled TEXT,
      cor_url TEXT,
      rfid_uid TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Pending registrations table created');
};

export const down = async () => {
  await dbRun('DROP TABLE IF EXISTS pending_registrations');
};

