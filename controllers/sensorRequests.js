import http from "http";

export const request = (ip) => {
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