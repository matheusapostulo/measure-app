import DatabaseConnection from '../../application/protocols/database/DatabaseConnection';
import Measure from '../../domain/Measure';
import { MeasureMongoose } from './schemas/MeasureSchema';
import mongoose from "mongoose";

export default class MongooseClientAdapter implements DatabaseConnection {
    connection: any;

    constructor(connection){
        this.connection = connection;
    }

    static async create() {
        const connection = await mongoose.connect("mongodb://admin:password@localhost:27017/measures?authSource=admin");
        return new MongooseClientAdapter(connection);
    }

    async saveMeasure(entity: any): Promise<any>{
        // Ensure connection is established before saving
        const {uuid, value, customerCode, measureDateTime, measureType, confirmed, imageUrl} = entity;
        return await MeasureMongoose.create({
            _id: uuid, 
            value: value,
            customer_code: customerCode,
            measure_datetime: measureDateTime,
            measure_type: measureType,
            has_confirmed: confirmed,
            image_url: imageUrl
        });
    }

    async findMeasuresByCustomerCodeAndType(customerCode: string, measureType: string): Promise<Measure[]>{
        return await MeasureMongoose.find({
            customer_code: customerCode,
            measure_type: measureType
        });
    }

    async findMeasuresByCustomerCode(customerCode: string): Promise<any>{
        return await MeasureMongoose.find({
            customer_code: customerCode
        });
    }

    async findUnique(id: string): Promise<any>{
        return await MeasureMongoose.findOne({ 
            _id: id 
        });
    }

    async updateMeasure(entity: any): Promise<any>{
        const {uuid, value,confirmed} = entity;
        return await MeasureMongoose.findOneAndUpdate({
            _id: uuid
        }, {
            value: value,
            has_confirmed: confirmed,
        });
       
    }

    isConnectionOpen(): boolean {
        return mongoose.connection.readyState === 1;
    }

    async close(): Promise<void> {
       await mongoose.disconnect();
    }
}