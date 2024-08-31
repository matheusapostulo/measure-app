import TakeMeasurement from "../../src/application/usecase/TakeMeasurement";
import GetMeasurements from "../../src/application/usecase/GetMeasurements";
import { typeMeasure } from "../../src/domain/Measure";
import MongooseClientAdapter from "../../src/infra/database/MongooseClientAdapter";
import MeasureRepositoryDatabase from "../../src/infra/repository/MeasureRepositoryDatabase";
import { randomBytes } from "crypto";
import NotFoundError from "../../src/application/errors/NotFoundError.error";
import GeminiAIService from "../../src/infra/services/GeminiAIService";
const fs = require('fs')

describe("Should get measurements", () => {
    it("Should get WATER measurements", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const geminiAIService = new GeminiAIService();
        const takeMeasurement = new TakeMeasurement(measureRepository, connection,geminiAIService);
        const getMeasurements = new GetMeasurements(connection);

        /* At first, we need to create measurements (providing data decoupled from the other tests */
        // Creating a random customer code to avoiding conflicts
        const randomCustomerCode = randomBytes(5).toString("hex");
        const inputTakeMeasurement = {
            image: fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER
        };
        const inputTakeMeasurement2 = {
            image: fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: new Date(),
            measure_type: typeMeasure.GAS
        };
        await takeMeasurement.execute(inputTakeMeasurement);
        await takeMeasurement.execute(inputTakeMeasurement2);

        /* Now we can test the GetMeasurements */
        const inputGetMeasurementsTypeMeasure = {
            customer_code: randomCustomerCode,
            measure_type: typeMeasure.WATER
        };
        const inputGetMeasurements = {
            customer_code: randomCustomerCode
        };

        const outputGetMeasurementsTypeMeasure = await getMeasurements.execute(inputGetMeasurementsTypeMeasure);
        const outputGetMeasurements = await getMeasurements.execute(inputGetMeasurements);

        await connection.close();

        expect(outputGetMeasurementsTypeMeasure.isRight()).toBe(true);
        expect(outputGetMeasurements.isRight()).toBe(true);

        if(outputGetMeasurementsTypeMeasure.isRight()){
            expect(outputGetMeasurementsTypeMeasure.value.measures).toHaveLength(1);
            expect(outputGetMeasurementsTypeMeasure.value.measures[0].measure_type).toBe(typeMeasure.WATER);
        }
        if(outputGetMeasurements.isRight()){
            expect(outputGetMeasurements.value.measures).toHaveLength(2);
        }   
    });
    it("Should return an error when trying to get without a customer code", async () => {
        const connection = await MongooseClientAdapter.create();
        const getMeasurements = new GetMeasurements(connection);

        const inputGetMeasurementsTypeMeasure = {
            customer_code: '2222222',
            measure_type: typeMeasure.WATER
        };

        const outputGetMeasurementsTypeMeasure = await getMeasurements.execute(inputGetMeasurementsTypeMeasure);
       
        await connection.close();
       
        expect(outputGetMeasurementsTypeMeasure.isLeft()).toBe(true);
        if(outputGetMeasurementsTypeMeasure.isLeft()){
            expect(outputGetMeasurementsTypeMeasure.value).toBeInstanceOf(NotFoundError);
        }   
    });
});
