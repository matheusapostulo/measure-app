import { typeMeasure } from "../../src/domain/Measure";
import TakeMeasurement from "../../src/application/usecase/TakeMeasurement";
import MeasureRepositoryDatabase from "../../src/infra/repository/MeasureRepositoryDatabase";
import MongooseClientAdapter from "../../src/infra/database/MongooseClientAdapter";


describe("Should do measurements", () => {
    it("Should do a Water measurement", async () => {
        const connection = new MongooseClientAdapter();
        const measureRepository = new MeasureRepositoryDatabase(connection);
        const takeMeasurement = new TakeMeasurement(measureRepository);

        const inputTakeMeasurement = {
            image: "123",
            customer_code: "1",
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER
        };
    
        const outputTakeMeasurement = await takeMeasurement.execute(inputTakeMeasurement);
   
        expect(outputTakeMeasurement.isRight()).toBeTruthy();
        if(outputTakeMeasurement.isRight()){
            expect(outputTakeMeasurement.value.measure_uuid).toBeDefined()
            expect(outputTakeMeasurement.value.image_url).toBeDefined()
            expect(outputTakeMeasurement.value.measure_value).toBeDefined()
        }

        await connection.close();
    });
});