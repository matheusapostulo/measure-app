import UsecaseProtocol from "../../../../../application/protocols/UsecaseProtocol";
import { InputTakeMeasurementDto, ResponseTakeMeasurement } from "../../../../../application/usecase/TakeMeasurement";
import Route, { HttpMethod } from "../Route";
import { Request, Response } from "express";

export default class TakeMeasurementRoute implements Route {

    constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly TakeMeasurementUseCase: UsecaseProtocol,
    ) {}

    public static create(TakeMeasurementUseCase: UsecaseProtocol){
        return new TakeMeasurementRoute(
            '/upload', 
            HttpMethod.POST, 
            TakeMeasurementUseCase,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const input: InputTakeMeasurementDto = request.body;

            const output: ResponseTakeMeasurement = await this.TakeMeasurementUseCase.execute(input);

            if(output.isLeft()){
                response.status(output.value.statusCode).json({error_code: output.value.message, error_description: output.value.errorDescription});
                return;
            }

            response.status(201).json(output.value);
        }
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

}