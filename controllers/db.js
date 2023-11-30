import pg from "pg";
import format from "pg-format";
import "dotenv/config";

const { Client } = pg;

const database = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT   
});

await database.connect();

export const getAll = () => {
    database.query(`
        SELECT  
            sensor.model AS sensor, 
            sensor.type, 
            sensor.format, 
            sensor.reading, 
            CONCAT_WS(controller.model, controller.id) AS controller, 
            runtime
        FROM sensor
            JOIN controller ON controller.id = sensor.controller
            JOIN cluster ON cluster.id = controller.id;
    `, (error, results) => {
        if (error) throw error;
        else console.log(results.rows);
    });
}

export const addNewReading = (sensorResponse) => {
    let values = [];

    for (let i = 0; i < sensorResponse.length; i++) {
        values.push([1, sensorResponse[i].sensorModel, sensorResponse[i].type, sensorResponse[i].format, sensorResponse[i].reading, sensorResponse[i].timestamp])
    }

    database.query(format(`
        INSERT INTO sensor (
            controller,
            model,
            type,
            format,
            reading,
            timestamp
        ) VALUES %L;
    `, values), (error) => {
        if (error) throw error;
    });
}