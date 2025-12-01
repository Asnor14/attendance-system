import { getDb, closeDb } from '../database/db.js';
import * as migration001 from './001_create_admins.js';
import * as migration002 from './002_create_students.js';
import * as migration003 from './003_create_schedules.js';
import * as migration004 from './004_create_devices.js';
import * as migration005 from './005_create_pending_registrations.js';

const migrations = [
  { name: '001_create_admins', ...migration001 },
  { name: '002_create_students', ...migration002 },
  { name: '003_create_schedules', ...migration003 },
  { name: '004_create_devices', ...migration004 },
  { name: '005_create_pending_registrations', ...migration005 },
];

const runMigrations = async () => {
  try {
    // Create migrations tracking table
    await new Promise((resolve, reject) => {
      getDb().run(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('🚀 Starting database migrations...\n');

    for (const migration of migrations) {
      const checkMigration = await new Promise((resolve, reject) => {
        getDb().get('SELECT name FROM migrations WHERE name = ?', [migration.name], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!checkMigration) {
        console.log(`Running migration: ${migration.name}`);
        await migration.up();
        
        await new Promise((resolve, reject) => {
          getDb().run('INSERT INTO migrations (name) VALUES (?)', [migration.name], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        console.log(`✅ ${migration.name} completed\n`);
      } else {
        console.log(`⏭️  ${migration.name} already executed\n`);
      }
    }

    console.log('✨ All migrations completed successfully!');
    await closeDb();
  } catch (error) {
    console.error('❌ Migration error:', error);
    await closeDb();
    process.exit(1);
  }
};

runMigrations();

