import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '../../config/env';

const runMigrations = async () => {
    console.log('⏳ Running migrations...');

    const connection = postgres(env.POSTGRES_URI, { max: 1 });
    const db = drizzle(connection);

    await migrate(db, { migrationsFolder: './src/app/db/postgres/drizzle' });

    await connection.end();

    console.log('✅ Migrations completed!');
    process.exit(0);
};

runMigrations().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
