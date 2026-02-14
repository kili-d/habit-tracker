const { initializeDatabase, pool } = require('./database');

async function main() {
  try {
    console.log('🔧 Initializing database...\n');
    await initializeDatabase();
    console.log('\n✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
