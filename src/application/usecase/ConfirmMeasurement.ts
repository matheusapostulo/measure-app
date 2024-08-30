import { AppError } from "../errors/AppError.error";
import { ConfirmMeasurementError } from "../errors/ConfirmMeasurement.error";
import { Either, left, right } from "../errors/either";
import InvalidDataError from "../errors/InvalidDataError.error";
import DatabaseConnection from "../protocols/database/DatabaseConnection";
import MeasureRepositoryProtocol from "../repository/MeasureRepositoryProtocol";

export default class ConfirmMeasurement {

    constructor(readonly connection: DatabaseConnection, readonly measurementRepository: MeasureRepositoryProtocol){    
    }

    async execute(input: InputConfirmMeasurementDto): Promise<ResponseConfirmMeasurement>{
        try {
            if(typeof(input.measure_uuid) != "string"){
                return left(new InvalidDataError("measure_uuid must be a string"));
            }
            if(typeof(input.confirmed_value) != "number"){
                return left(new InvalidDataError("confirmed_value must be a number"));
            }

            const measure = await this.measurementRepository.getMeasure(input.measure_uuid);
            
            if(!measure){
                return left(new ConfirmMeasurementError.NotFoundError());
            }
            if(measure.confirmed){
                return left(new ConfirmMeasurementError.AlreadyConfirmedError());
            }
            measure.confirmMeasure();
            measure.updateValue(input.confirmed_value);
            await this.measurementRepository.updateMeasure(measure);
            
            return right(true);
        } catch (error) {
            return left(new AppError.UnexpectedError());
        };
    }
}

export type InputConfirmMeasurementDto = {
    measure_uuid: string;
    confirmed_value: number;
}

export type OutputConfirmMeasurementDto = {
    success: boolean;
}

export type ResponseConfirmMeasurement = Either<
    AppError.UnexpectedError |
    ConfirmMeasurementError.NotFoundError |
    ConfirmMeasurementError.AlreadyConfirmedError |
    InvalidDataError
    ,
    boolean
>;