import 'dotenv/config';
import mongoose from 'mongoose';
import agenda from './agenda';
import releaseHoldVehicles from '@app/jobs/vehicles';

(async () => {
    try {
        releaseHoldVehicles(agenda);
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
