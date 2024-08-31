import Measure, { typeMeasure } from "../../domain/Measure";
import MeasureRepositoryProtocol from "../repository/MeasureRepositoryProtocol";
import { AppError } from "../errors/AppError.error";
import { Either, left, right } from "../errors/either";
import RequiredParametersError from "../errors/RequiredParameters.error";
import DatabaseConnection from "../protocols/database/DatabaseConnection";
import { TakeMeasurementError } from "../errors/TakeMeasurement.error";
import GeminiAiServiceProtocol from "../protocols/GeminiAIServiceProtocol";

export default class TakeMeasurement {
    
    constructor(
        readonly measureRepository: MeasureRepositoryProtocol, 
        readonly connection: DatabaseConnection,
        readonly geminiAIService: GeminiAiServiceProtocol    
    ) {
    }
    
    async execute(input: InputTakeMeasurementDto): Promise<ResponseTakeMeasurement>{
        try {
            // Validating the base64 image
            let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
            if(!base64regex.test(input.image)){
                return left(new RequiredParametersError("image"));
            }
            // We'll get this variable from an AI service
            const imageUrl = "https://www.google.com.br";
            const value = await this.geminiAIService.getMeasureValue(input.image);
            // Checking if already exists a Measure with the same month and year
            const measureAlreadyExistsInMonth = await this.connection.findMeasuresByCustomerCodeAndType(input.customer_code, input.measure_type);
            if(measureAlreadyExistsInMonth.some(measure => {
                return input.measure_datetime.getMonth() + 1 === measure.measure_datetime.getMonth() + 1
                &&
                input.measure_datetime.getFullYear() === measure.measure_datetime.getFullYear();
            })) {
                return left(new TakeMeasurementError.MeasureAlreadyExists)
            }
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
    RequiredParametersError |
    AppError.UnexpectedError |
    TakeMeasurementError.MeasureAlreadyExists
    ,
    OutputTakeMeasurementDto
>;