import { typeMeasure } from "../../src/domain/Measure";
import TakeMeasurement from "../../src/application/usecase/TakeMeasurement";
import MeasureRepositoryDatabase from "../../src/infra/repository/MeasureRepositoryDatabase";
import MongooseClientAdapter from "../../src/infra/database/MongooseClientAdapter";
import { TakeMeasurementError } from "../../src/application/errors/TakeMeasurement.error";
import { randomBytes } from "crypto";
import GeminiAIService from "../../src/infra/services/GeminiAIService";
const fs = require('fs')

describe("Should do measurements", () => {
    it("Should do a Water measurement", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const geminiAIService = new GeminiAIService();
        const takeMeasurement = new TakeMeasurement(measureRepository, connection, geminiAIService);

        // Creating a random customer code to avoiding conflicts
        const randomCustomerCode = randomBytes(5).toString("hex");

        const inputTakeMeasurement = {
            image:  fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER
        };
    
        const outputTakeMeasurement = await takeMeasurement.execute(inputTakeMeasurement);
        
        await connection.close();

        expect(outputTakeMeasurement.isRight()).toBeTruthy();
        if(outputTakeMeasurement.isRight()){
            expect(outputTakeMeasurement.value.measure_uuid).toBeDefined()
            expect(outputTakeMeasurement.value.image_url).toBeDefined()
            expect(outputTakeMeasurement.value.measure_value).toBeDefined()
        }
    });

    it("Should throw an error when there is a measurement with the same month and year", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const geminiAIService = new GeminiAIService();
        const takeMeasurement = new TakeMeasurement(measureRepository, connection, geminiAIService);

        // Creating a date for the next month
        const currentDate = new Date();
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);

        // Creating a random customer code to avoiding conflicts
        const randomCustomerCode = randomBytes(5).toString("hex");

        // Creating the first measurement
        const inputTakeMeasurement = {
            image: fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: nextMonth,
            measure_type: typeMeasure.WATER
        };
        await takeMeasurement.execute(inputTakeMeasurement);

        // Creating the second measurement with the same month and year
        const inputTakeMeasurementSameMonth = {
            image: fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: inputTakeMeasurement.measure_datetime,
            measure_type: typeMeasure.WATER
        };
        const outputTakeMeasurementSameMonth = await takeMeasurement.execute(inputTakeMeasurementSameMonth);

        // Creating an third measurement with the same month and year, but with different type
        const inputTakeMeasurementSameMonthDifferentTypeMeasure = {
            image: fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: inputTakeMeasurement.measure_datetime,
            measure_type: typeMeasure.GAS
        };
        const outputTakeMeasurementSameMonthDifferentTypeMeasure = await takeMeasurement.execute(inputTakeMeasurementSameMonthDifferentTypeMeasure);   

        await connection.close();

        expect(outputTakeMeasurementSameMonth.isLeft()).toBeTruthy();
        if(outputTakeMeasurementSameMonth.isLeft()){
            expect(outputTakeMeasurementSameMonth.value).toBeInstanceOf(TakeMeasurementError.MeasureAlreadyExists);
        }

        expect(outputTakeMeasurementSameMonthDifferentTypeMeasure.isRight()).toBeTruthy();
        if(outputTakeMeasurementSameMonthDifferentTypeMeasure.isRight()){
            expect(outputTakeMeasurementSameMonthDifferentTypeMeasure.value.measure_uuid).toBeDefined()
            expect(outputTakeMeasurementSameMonthDifferentTypeMeasure.value.image_url).toBeDefined()
            expect(outputTakeMeasurementSameMonthDifferentTypeMeasure.value.measure_value).toBeDefined()
        }
    })
});