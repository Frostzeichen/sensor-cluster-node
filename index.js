import http from "http";
import "dotenv/config"

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const addresses = [process.env.MCU_1]

const request = (ip) => {
    const options = { 
        hostname: ip, 
        path: "/", 
        method: "GET"
    }

    return new Promise ((resolve, reject) => {
        http.request(options, (res) => { 
            let data = "";
                
            res.on("data", (chunk) => { 
                data += chunk; 
            });
            res.on("end", () => { 
                resolve(JSON.parse(data));
            });
                
        }).on("error", (err) => { 
            reject(console.log("Error: ", err));
        }).end();
    })
}

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