const { Client } = require('pg');
require('dotenv').config();

async function check(url, name) {
    const client = new Client({ connectionString: url });
    try {
        await client.connect();
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Conversation'");
        const columns = res.rows.map(r => r.column_name);
        console.log(`[${name}] Columns in Conversation:`, columns.join(', '));
        console.log(`[${name}] Has tags?`, columns.includes('tags'));
        console.log(`[${name}] Has transcription?`, res.rows.some(r => r.column_name === 'transcription'));
    } catch (e) {
        console.error(`[${name}] Error:`, e.message);
    } finally {
        await client.end();
    }
}

async function run() {
    console.log("Checking DB schema...");
    await check(process.env.DATABASE_URL, "Pooler (6543)");
    await check(process.env.DIRECT_URL, "Direct (5432)");
}

run();
