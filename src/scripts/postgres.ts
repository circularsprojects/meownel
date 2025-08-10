import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Pool } from "pg";

const parser = yargs(hideBin(process.argv)).options({
    create: { type: 'boolean', describe: 'Create database tables' },
    delete: { type: 'boolean', describe: 'Delete database tables' },
    add: { type: 'boolean', describe: 'Add an example database entry' },
    name: { type: 'string', describe: 'Name of the pod' },
    displayName: { type: 'string', describe: 'Display name of the pod' },
}).conflicts({
    create: 'delete',
    delete: 'create',
    add: ['create', 'delete']
}).check(argv => {
    if (argv.add && (!argv.name || !argv.displayName)) {
        throw new Error('--add requires both --name and --displayName to be set');
    }
    return true;
})

const pool = new Pool({
    connectionString: "postgres://circular@localhost:5432/meownel",
})

async function main() {
    const argv = await parser.parse();

    if (argv.create) {
        console.log("Creating database tables...");
        const client = await pool.connect();
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS pods (
                    name TEXT PRIMARY KEY,
                    display_name TEXT,
                    node TEXT,
                    image TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    config_path TEXT
                );
            `);
            console.log("Database tables created successfully.");
        } catch(err) {
            console.error("Error creating database tables: ", err);
        } finally {
            client.release();
        }
    } else if (argv.delete) {
        console.log("Deleting database tables...");
        const client = await pool.connect();
        try {
            await client.query(`
                DROP TABLE IF EXISTS pods;
            `);
            console.log("Database tables deleted successfully.");
        } catch(err) {
            console.error("Error deleting database tables: ", err);
        } finally {
            client.release();
        }
    } else if (argv.add) {
        console.log("Adding example database entry...");
        const client = await pool.connect();
        try {
            await client.query(`
                INSERT INTO pods (name, display_name, node, image, config_path)
                VALUES ($1, $2, 'kube-node-1', 'itzg/minecraft-server', '/path/to/config.yaml')
                ON CONFLICT (name) DO NOTHING;
            `, [argv.name, argv.displayName]);
            console.log("Example database entry added successfully.");
        } catch(err) {
            console.error("Error adding example database entry: ", err);
        } finally {
            client.release();
        }
    } else {
        console.log("No action specified. Use --create to create tables or --delete to delete tables.");
        return;
    }
}

main().catch(err => {
    console.error("Error:", err);
    process.exit(1);
}).finally(() => {
    pool.end();
});

