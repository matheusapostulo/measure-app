import { MeasureMongoose } from './schemas/MeasureSchema';
import mongoose from "mongoose";

export default class MongooseClientAdapter {
    connection: any;

    constructor(){
        this.connection = mongoose.connect("mongodb://admin:password@localhost:27017/measures?authSource=admin");
    }

    async saveMeasure(entity: any): Promise<any>{
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

    isConnectionOpen(): boolean {
        return mongoose.connection.readyState === 1;
    }

    async close(): Promise<void> {
       await mongoose.disconnect();
    }
}