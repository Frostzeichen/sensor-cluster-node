import { request } from "./controllers/sensorRequests.js";
import { delay } from "./controllers/time.js";
import { addNewReading, getAll } from "./controllers/db.js";
import "dotenv/config"

const addresses = [process.env.MCU_1]

const main = async (cycleLimit) => {
    let dataCache = [];
    let cycles = 0;

    for (;;) {
        for (let i = 0; i < addresses.length; i++) {
            request(addresses[i]).then((data) => dataCache.push(data));
        }

        if (cycles == cycleLimit) { // One cycle is designed for roughly 1 second
            console.log("Saving...");
            if (dataCache.length > 0) {
                addNewReading(dataCache);
                console.log("Saved to database!");
            } else {
                console.log("Cache is empty. Waiting for new data.");
                console.log("PS. Are there any controllers online?");
            }
            getAll();
            cycles = 0;
            dataCache = [];
        } else cycles++;

        console.log(`Cycles: ${cycles}`);
        await delay(process.env.INTERVAL);
    }
}
main(process.env.CYCLES);