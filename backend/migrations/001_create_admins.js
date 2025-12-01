import bcrypt from 'bcrypt';
import { dbRun, dbGet } from '../database/db.js';

export const up = async () => {
  // Create admins table
  await dbRun(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if admin already exists
  const existingAdmin = await dbGet('SELECT id FROM admins WHERE username = ?', ['admin']);
  
  if (!existingAdmin) {
    // Create default admin with hashed password
    const password = 'admin123';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    await dbRun(
      'INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)',
      ['admin', passwordHash, 'admin']
    );
    
    console.log('✅ Default admin created: username=admin, password=admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }
};

export const down = async () => {
  await dbRun('DROP TABLE IF EXISTS admins');
};

