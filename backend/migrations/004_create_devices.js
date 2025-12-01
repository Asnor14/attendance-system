import { dbRun } from '../database/db.js';

export const up = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_name TEXT NOT NULL,
      device_type TEXT NOT NULL CHECK(device_type IN ('kiosk', 'esp')),
      status TEXT DEFAULT 'offline' CHECK(status IN ('online', 'offline', 'maintenance')),
      last_sync DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Devices table created');
};

export const down = async () => {
  await dbRun('DROP TABLE IF EXISTS devices');
};

