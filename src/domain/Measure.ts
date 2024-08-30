import crypto from "crypto";
import { Either, right } from "../application/errors/either";
import RequiredParametersError from "../application/errors/RequiredParameters.error";

export default class Measure {
    constructor(
        readonly uuid: string, 
        readonly value: number,
        readonly customerCode: string,
        readonly measureDateTime: Date,
        readonly measureType: typeMeasure,
        private confirmed: boolean,
        readonly imageUrl: string, 
    ) { }
    
    static create(value: number, customerCode: string, measureDateTime: Date, measureType: typeMeasure, imageUrl: string): ResponseCreateMeasureDomain {
        const uuid = crypto.randomUUID();
        const confirmed = false;
        return right(new Measure(uuid, value, customerCode, measureDateTime, measureType, confirmed, imageUrl));
    }
}

export enum typeMeasure {
    WATER = "WATER",
    GAS = "GAS"
};

export type ResponseCreateMeasureDomain = Either<
    RequiredParametersError
    ,
    Measure
>;