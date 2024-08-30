import crypto from "crypto";
import { Either, left, right } from "../application/errors/either";
import RequiredParametersError from "../application/errors/RequiredParameters.error";

export default class Measure {
    constructor(
        readonly uuid: string, 
        private value: number,
        readonly customerCode: string,
        readonly measureDateTime: Date,
        readonly measureType: typeMeasure,
        private confirmed: boolean,
        readonly imageUrl: string, 
    ) { }
    
    static create(value: number, customerCode: string, measureDateTime: Date, measureType: typeMeasure, imageUrl: string): ResponseCreateMeasureDomain {
        // Validate required parameters
        if(!customerCode) return left(new RequiredParametersError("customer_code"));
        if(!measureDateTime) return left(new RequiredParametersError("measure_datetime"));
        if(!measureType) return left(new RequiredParametersError("measure_type"));
        const uuid = crypto.randomUUID();
        const confirmed = false;
        return right(new Measure(uuid, value, customerCode, measureDateTime, measureType, confirmed, imageUrl));
    }

    confirmMeasure(){
        this.confirmed = true;
    }

    updateValue(value: number){
        this.value = value;
    }

    getValue(){
        return this.value;
    }

    getConfirmed(){
        return this.confirmed;
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