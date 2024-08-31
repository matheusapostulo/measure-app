import { randomBytes } from "crypto";
import ConfirmMeasurement from "../../src/application/usecase/ConfirmMeasurement";
import TakeMeasurement from "../../src/application/usecase/TakeMeasurement";
import MongooseClientAdapter from "../../src/infra/database/MongooseClientAdapter";
import MeasureRepositoryDatabase from "../../src/infra/repository/MeasureRepositoryDatabase";
import { typeMeasure } from "../../src/domain/Measure";
import { ConfirmMeasurementError } from "../../src/application/errors/ConfirmMeasurement.error";
import InvalidDataError from "../../src/application/errors/InvalidDataError.error";
import GeminiAIService from "../../src/infra/services/GeminiAIService";
const fs = require('fs')

describe("Should confirm measurements", () => {
    it("Should confirm a measurement with a new value", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const geminiAIService = new GeminiAIService();
        const takeMeasurement = new TakeMeasurement(measureRepository, connection, geminiAIService);
        const confirmMeasurement = new ConfirmMeasurement(connection, measureRepository);

        // Creating a measurement to confirm
        // Creating a random customer code to avoiding conflicts
        const randomCustomerCode = randomBytes(5).toString("hex");

        const inputTakeMeasurement = {
            image: fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER
        };
    
        const outputTakeMeasurement = await takeMeasurement.execute(inputTakeMeasurement);

        if(outputTakeMeasurement.isRight()){
            const inputConfirmMeasurement = {
                measure_uuid: outputTakeMeasurement.value.measure_uuid,
                confirmed_value: 55555
            };
    
            const outputConfirmMeasurement = await confirmMeasurement.execute(inputConfirmMeasurement);
    
            await connection.close();
            
            if(outputConfirmMeasurement.isRight()){
                expect(outputConfirmMeasurement.value).toBe(true);
            }
        }
    });

    it("Should throw an error when there is no measurement to confirm", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const confirmMeasurement = new ConfirmMeasurement(connection, measureRepository);

        const inputConfirmMeasurement = {
            measure_uuid: '1233332123',
            confirmed_value: 1234
        };

        const outputConfirmMeasurement = await confirmMeasurement.execute(inputConfirmMeasurement);

        await connection.close();
        
        if(outputConfirmMeasurement.isLeft()){
            expect(outputConfirmMeasurement.value).toBeInstanceOf(ConfirmMeasurementError.NotFoundError);
        }
        
    });

    it("Should throw an error when the measurement is already confirmed", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const geminiAIService = new GeminiAIService();
        const takeMeasurement = new TakeMeasurement(measureRepository, connection, geminiAIService);
        const confirmMeasurement = new ConfirmMeasurement(connection, measureRepository);

        // Creating a measurement to confirm
        // Creating a random customer code to avoiding conflicts
        const randomCustomerCode = randomBytes(5).toString("hex");

        const inputTakeMeasurement = {
            image: fs.readFileSync("./base64.txt").toString(),
            customer_code: randomCustomerCode,
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER
        };
    
        const outputTakeMeasurement = await takeMeasurement.execute(inputTakeMeasurement);

        if(outputTakeMeasurement.isRight()){
            const inputConfirmMeasurement = {
                measure_uuid: outputTakeMeasurement.value.measure_uuid,
                confirmed_value: 1234
            };
            
            await confirmMeasurement.execute(inputConfirmMeasurement);
            const outputConfirmMeasurementAgain = await confirmMeasurement.execute(inputConfirmMeasurement);

            await connection.close();
            
            if(outputConfirmMeasurementAgain.isLeft()){
                expect(outputConfirmMeasurementAgain.value).toBeInstanceOf(ConfirmMeasurementError.AlreadyConfirmedError);
            }
        }
    });

    it("Should throw an error when the measure_uuid is not a string", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const confirmMeasurement = new ConfirmMeasurement(connection, measureRepository);

        const inputConfirmMeasurement = {
            measure_uuid: 1234,
            confirmed_value: 55555
        };

        const outputConfirmMeasurement = await confirmMeasurement.execute(inputConfirmMeasurement);

        await connection.close();
        
        if(outputConfirmMeasurement.isLeft()){
            expect(outputConfirmMeasurement.value).toBeInstanceOf(InvalidDataError);
        }
    });

    it("Should throw an error when the confirmed_value is not a number", async () => {
        const connection = await MongooseClientAdapter.create();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const confirmMeasurement = new ConfirmMeasurement(connection, measureRepository);

        const inputConfirmMeasurement = {
            measure_uuid: '1234',
            confirmed_value: '1234'
        };

        const outputConfirmMeasurement = await confirmMeasurement.execute(inputConfirmMeasurement);

        await connection.close();
        
        if(outputConfirmMeasurement.isLeft()){
            expect(outputConfirmMeasurement.value).toBeInstanceOf(InvalidDataError);
        }
    });
});