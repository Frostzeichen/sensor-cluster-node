import http from "http";

export const request = (ip) => { // TODO: Add a way to find out whether the MCU is present or not, and return a message that the MCU is offline.
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
                let output = JSON.parse(data);
                output["timestamp"] = new Date();
                resolve(output);
            });
                
        }).on("error", (err) => { 
            reject(console.log("Error: ", err));
        }).end();
    }).catch(() => {console.log("Controller is offline")})
}