import 'dotenv/config';
import mongoose from 'mongoose';
import Agenda from "agenda";
const uri = process.env.MONGO_URI + "/" + process.env.MONGO_DB_NAME;

const agenda = new Agenda({
    db: { address: uri, collection: "jobs" },
    processEvery: '30 seconds'
});

(async () => {
    try {
        // functions for agenda jobs should be defined and imported here
        await agenda.start();
        console.log(`[${process.pid}] Agenda Worker started`);
    } catch (err) {
        console.error('Error starting Agenda Worker:', err);
    }
})();

process.on('SIGINT', async () => {
    console.log('Stopping Agenda Worker...');
    await agenda.stop();
    await mongoose.disconnect();
    process.exit(0);
});
