import { request } from "./controllers/sensorRequests.js";
import { delay } from "./controllers/time.js";
import "dotenv/config"

const addresses = [process.env.MCU_1]

const main = async () => {
    let dataCache = [];
    for (;;) {
        for (let i = 0; i < addresses.length; i++) {
            request(addresses[i]).then((data) => dataCache.push(data));
        }
        console.log(dataCache);
        
        await delay(process.env.INTERVAL);
    }
}
main();