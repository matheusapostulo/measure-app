import { AppError } from '../errors/AppError.error';
import { Either, left, right } from './../errors/either';
import { typeMeasure } from '../../domain/Measure';
import DatabaseConnection from '../protocols/database/DatabaseConnection';
import NotFoundError from '../errors/NotFoundError.error';

export default class GetMeasurements {

    constructor(readonly connection: DatabaseConnection){
    }

    async execute(input: InputGetMeasurementsDto): Promise<ResponseGetMeasurements>{
        try {
            /* 
                We don't need to go through the domain layer, because we won't use mutation commands (CQRS). 
                We can go directly to the database layer 
            */
            let measures;
            if(input.measure_type){
                measures = await this.connection.findMeasuresByCustomerCodeAndType(input.customer_code, input.measure_type);
            } else {
                measures = await this.connection.findMeasuresByCustomerCode(input.customer_code);
            }

            if(measures.length === 0){
                return left(new NotFoundError("Nenhuma leitura encontrada"));
            }

            const filteredMeasures = measures.map(measure => {
                return {
                    measure_uuid: measure._id,
                    measure_value: measure.value,
                    measure_datetime: measure.measure_datetime,
                    measure_type: measure.measure_type,
                    has_confirmed: measure.has_confirmed,
                    image_url: measure.image_url
                };
            });

            const resMeasures = {
                customer_code: input.customer_code,
                measures: filteredMeasures
            }

            return right(resMeasures);
        } catch (error) {
            return left(new AppError.UnexpectedError());
        };

        
    }
}

type MeasureResponse = {
    measure_uuid: string;
    measure_value: number;
    measure_datetime: Date;
    measure_type: typeMeasure;
    has_confirmed: boolean;
    image_url: string;
};

export type InputGetMeasurementsDto = {
    customer_code: string;
    measure_type?: typeMeasure;
} 

export type OutputGetMeasurementsDto = {
    customer_code: string;
    measures: MeasureResponse[];
};

export type ResponseGetMeasurements = Either<
    AppError.UnexpectedError | 
    NotFoundError
    ,
    OutputGetMeasurementsDto
>;
