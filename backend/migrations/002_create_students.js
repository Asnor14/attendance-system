import { dbRun } from '../database/db.js';

export const up = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      student_id TEXT UNIQUE NOT NULL,
      course TEXT NOT NULL,
      rfid_uid TEXT UNIQUE,
      face_image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Students table created');
};

export const down = async () => {
  await dbRun('DROP TABLE IF EXISTS students');
};

