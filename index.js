import { request } from "./controllers/sensorRequests.js";
import { delay } from "./controllers/time.js";
import { addNewReading, getAll } from "./controllers/db.js";
import "dotenv/config"

const addresses = [process.env.MCU_1]

const main = async () => {
    let dataCache = [];
    let cycles = 0;

    for (;;) {
        for (let i = 0; i < addresses.length; i++) {
            request(addresses[i]).then((data) => {
                data["timestamp"] = new Date();
                return dataCache.push(data)
            });
        }

        if (cycles == 3) { // One cycle is designed for roughly 1 second
            console.log("Saving...")
            addNewReading(dataCache);
            dataCache = [];
            getAll();
            cycles = 0;
            console.log("Done!");
        } else cycles++;

        console.log(`Cycles: ${cycles}`);
        await delay(process.env.INTERVAL);
    }
}
main();