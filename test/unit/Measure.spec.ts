import RequiredParametersError from "../../src/application/errors/RequiredParameters.error";
import Measure, { typeMeasure } from "../../src/domain/Measure";

describe("Measure domain unit tests", () => {
    it("Should create a new WATER measure", () => {
        // Input
        const inputCreateMeasure = {
            value: 100,
            customerCode: '123456',
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER,
            image_url: 'http://localhost:3000/image.jpg'
        };
        // Output
        const outputCreateMeasure = Measure.create(inputCreateMeasure.value, inputCreateMeasure.customerCode, inputCreateMeasure.measure_datetime, inputCreateMeasure.measure_type, inputCreateMeasure.image_url);
        // Expects
        expect(outputCreateMeasure.isRight()).toBeTruthy();
        if(outputCreateMeasure.isRight()){
            expect(outputCreateMeasure.value.uuid).toBeDefined();
            expect(outputCreateMeasure.value.value).toBe(100);
            expect(outputCreateMeasure.value.customerCode).toBe('123456');
            expect(outputCreateMeasure.value.measureDateTime).toBeDefined();
            expect(outputCreateMeasure.value.measureType).toBe('WATER');
            expect(outputCreateMeasure.value.imageUrl).toBe('http://localhost:3000/image.jpg');
        };     
    });

    it("Should create a new GAS measure", () => {
        // Input
        const inputCreateMeasure = {
            value: 100,
            customerCode: '123456',
            measure_datetime: new Date(),
            measure_type: typeMeasure.GAS,
            image_url: 'http://localhost:3000/image.jpg'
        };
        // Output
        const outputCreateMeasure = Measure.create(inputCreateMeasure.value, inputCreateMeasure.customerCode, inputCreateMeasure.measure_datetime, inputCreateMeasure.measure_type, inputCreateMeasure.image_url);
        // Expects
        expect(outputCreateMeasure.isRight()).toBeTruthy();
        if(outputCreateMeasure.isRight()){
            expect(outputCreateMeasure.value.uuid).toBeDefined();
            expect(outputCreateMeasure.value.value).toBe(100);
            expect(outputCreateMeasure.value.customerCode).toBe('123456');
            expect(outputCreateMeasure.value.measureDateTime).toBeDefined();
            expect(outputCreateMeasure.value.measureType).toBe('GAS');
            expect(outputCreateMeasure.value.imageUrl).toBe('http://localhost:3000/image.jpg');
        }
    });

    it("Should confirm a measure", () => {
        // Input
        const inputCreateMeasure = {
            value: 100,
            customerCode: '123456',
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER,
            image_url: 'http://localhost:3000/image.jpg'
        };
        // Output
        const outputCreateMeasure = Measure.create(inputCreateMeasure.value, inputCreateMeasure.customerCode, inputCreateMeasure.measure_datetime, inputCreateMeasure.measure_type, inputCreateMeasure.image_url);
        if(outputCreateMeasure.isRight()){
            outputCreateMeasure.value.confirmMeasure();
            expect(outputCreateMeasure.value.getConfirmed()).toBeTruthy();
        }
    });

    it("Should update a measure value", () => {
        // Input
        const inputCreateMeasure = {
            value: 100,
            customerCode: '123456',
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER,
            image_url: 'http://localhost:3000/image.jpg'
        };
        // Output
        const outputCreateMeasure = Measure.create(inputCreateMeasure.value, inputCreateMeasure.customerCode, inputCreateMeasure.measure_datetime, inputCreateMeasure.measure_type, inputCreateMeasure.image_url);
        if(outputCreateMeasure.isRight()){
            outputCreateMeasure.value.updateValue(200);
            expect(outputCreateMeasure.value.getValue()).toBe(200);
        }
    });


    it("Should return an error when customerCode is not provided or invalid", () => {
        // Input
        const inputCreateMeasure = {
            value: 100,
            customerCode: '',
            measure_datetime: new Date(),
            measure_type: typeMeasure.WATER,
            image_url: 'http://localhost:3000/image.jpg'
        };
        // Output
        const outputCreateMeasure = Measure.create(inputCreateMeasure.value, inputCreateMeasure.customerCode, inputCreateMeasure.measure_datetime, inputCreateMeasure.measure_type, inputCreateMeasure.image_url);
        // Expects
        expect(outputCreateMeasure.isLeft()).toBeTruthy();
        if(outputCreateMeasure.isLeft()){
            expect(outputCreateMeasure.value).toBeInstanceOf(RequiredParametersError);
        }
    });

    it("Should return an error when measureDateTime is not provided or invalid", () => {
        // Input
        const inputCreateMeasure = {
            value: 100,
            customerCode: '123456',
            measure_datetime: null,
            measure_type: typeMeasure.WATER,
            image_url: 'http://localhost:3000/image.jpg'
        };
        // Output
        const outputCreateMeasure = Measure.create(inputCreateMeasure.value, inputCreateMeasure.customerCode, inputCreateMeasure.measure_datetime, inputCreateMeasure.measure_type, inputCreateMeasure.image_url);
        // Expects
        expect(outputCreateMeasure.isLeft()).toBeTruthy();
        if(outputCreateMeasure.isLeft()){
            expect(outputCreateMeasure.value).toBeInstanceOf(RequiredParametersError);
        }
    });

    it("Should return an error when measureType is not provided or invalid", () => {
        // Input
        const inputCreateMeasure = {
            value: 100,
            customerCode: '123456',
            measure_datetime: new Date(),
            measure_type: null,
            image_url: 'http://localhost:3000/image.jpg'
        };
        // Output
        const outputCreateMeasure = Measure.create(inputCreateMeasure.value, inputCreateMeasure.customerCode, inputCreateMeasure.measure_datetime, inputCreateMeasure.measure_type, inputCreateMeasure.image_url);
        // Expects
        expect(outputCreateMeasure.isLeft()).toBeTruthy();
        if(outputCreateMeasure.isLeft()){
            expect(outputCreateMeasure.value).toBeInstanceOf(RequiredParametersError);
        }
    });
})