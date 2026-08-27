import { app } from "./app.js";
import { env } from "./config/env.js";
import { checkDbConnection } from "./config/db.js";

async function start() {
    try {
        await checkDbConnection();
        console.log('Connection to PostgreSQL succeed');
    } catch (err) {
        console.error('it couldn\'t connect to the database:', err.message);
        process.exit(1);
    }
    app.listen(env.port, () => {
        console.log(`Auth Service listenning in the ${env.port} port (${env.nodeEnv})`);
    });
}

start();