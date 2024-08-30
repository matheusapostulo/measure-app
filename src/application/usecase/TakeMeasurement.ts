import Measure, { typeMeasure } from "../../domain/Measure";
import MeasureRepositoryProtocol from "../repository/MeasureRepositoryProtocol";
import { AppError } from "../errors/AppError.error";
import { Either, left, right } from "../errors/either";
import RequiredParametersError from "../errors/RequiredParameters.error";

export default class TakeMeasurement {
    
    constructor(readonly measureRepository: MeasureRepositoryProtocol) {
        this.measureRepository = measureRepository;
    }
    
    async execute(input: InputTakeMeasurementDto): Promise<ResponseTakeMeasurement>{
        try {
            // We'll get this variable from an AI service
            const imageUrl = "https://www.google.com.br";
            const value = 123;
            // Try to create a new Measure with the data provided
            const measureOrError = Measure.create(value, input.customer_code, input.measure_datetime, input.measure_type, imageUrl);
            // If the Measure creation fails, return an error
            if(measureOrError.isLeft()){
                return left(new AppError.UnexpectedError());
            }
            // If the Measure creation is successful, save the Measure to the database
            const measure: Measure = measureOrError.value;
            await this.measureRepository.saveMeasure(measure);

            // Return the Measure data
            return right({
                image_url: imageUrl,
                measure_value: value,
                measure_uuid: measure.uuid,
            });
        } catch (error) {
            return left(new AppError.UnexpectedError());
        }
    }
}

export type InputTakeMeasurementDto = {
    image: string;
    customer_code: string;
    measure_datetime: Date;
    measure_type: typeMeasure;
}

export type OutputTakeMeasurementDto = {
    image_url: string;
    measure_value: number;
    measure_uuid: string;
}

export type ResponseTakeMeasurement = Either<
    AppError.UnexpectedError |
    RequiredParametersError 
    ,
    OutputTakeMeasurementDto
>;