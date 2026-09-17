const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function setup() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/amrit_rasoi';
  let urlObj;
  try {
    urlObj = new URL(dbUrl);
  } catch (e) {
    console.error('Invalid DATABASE_URL in .env');
    process.exit(1);
  }
  
  const user = decodeURIComponent(urlObj.username || 'postgres');
  const password = decodeURIComponent(urlObj.password || 'postgres');
  const host = urlObj.hostname || 'localhost';
  const port = urlObj.port || 5432;
  const targetDb = decodeURIComponent(urlObj.pathname.replace('/', '') || 'amrit_rasoi');

  const isCloudOrSsl = dbUrl.includes('sslmode=') || dbUrl.includes('neon.tech') || dbUrl.includes('supabase');

  const clientConfig = {
    connectionString: dbUrl,
    ssl: isCloudOrSsl ? { rejectUnauthorized: false } : false
  };

  if (!isCloudOrSsl) {
    const defaultClient = new Client({
      user,
      password,
      host,
      port,
      database: 'postgres',
      ssl: false,
    });

    try {
      await defaultClient.connect();
      console.log(`✅ Connected to PostgreSQL default database.`);

      const checkDb = await defaultClient.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [targetDb]
      );

      if (checkDb.rows.length === 0) {
        console.log(`📦 Creating new isolated database '${targetDb}'...`);
        await defaultClient.query(`CREATE DATABASE "${targetDb}"`);
        console.log(`✅ Database '${targetDb}' created successfully!`);
      } else {
        console.log(`ℹ️ Database '${targetDb}' already exists.`);
      }
    } catch (err) {
      console.error(`❌ Failed to connect: ${err.message}`);
      console.error(`Please make sure PostgreSQL is running and update your password in backend/.env!`);
      process.exit(1);
    } finally {
      await defaultClient.end();
    }
  }

  const targetClient = new Client(clientConfig);

  try {
    await targetClient.connect();
    console.log(`🚀 Executing tables & seed data script in database...`);

    const sqlPath = path.join(__dirname, '../prisma/schema_and_data.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await targetClient.query(sql);
    console.log(`🎉 SUCCESS: All tables and seed data created successfully!\n`);
  } catch (err) {
    console.error(`❌ Error executing schema script: ${err.message}`);
  } finally {
    await targetClient.end();
  }
}

setup();
