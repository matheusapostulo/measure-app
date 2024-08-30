import {Schema, model, models} from 'mongoose';

const MeasureSchema = new Schema({
    _id: String,
    value: Number,
    customer_code: String,
    measure_datetime: Date,
    measure_type: String,
    has_confirmed: Boolean,
    image_url: String,
}, { versionKey: false });

export const MeasureMongoose = models.MeasureMongoose || model('Measure', MeasureSchema);
