import TakeMeasurement from "./application/usecase/TakeMeasurement";
import ApiExpress from "./infra/api/express/api.express";
import TakeMeasurementRoute from "./infra/api/express/routes/measure/TakeMeasurement.express.route";
import MongooseClientAdapter from "./infra/database/MongooseClientAdapter";
import MeasureRepositoryDatabase from "./infra/repository/MeasureRepositoryDatabase";
import GeminiAIService from "./infra/services/GeminiAIService";

async function main() {
    // Connection to the database
    const connection = await MongooseClientAdapter.create();

    // Repository's
    const measureRepository = new MeasureRepositoryDatabase(connection);

    // Others dependencies
    const geminiAIService = new GeminiAIService();

    // Importing use cases
    const takeMeasurement = new TakeMeasurement(measureRepository, connection, geminiAIService);

    // Importing routes
    const takeMeasurementRoute = TakeMeasurementRoute.create(takeMeasurement);

    // Initialize the API
    const api = ApiExpress.create([
        takeMeasurementRoute
    ]);
    
    const port = 3000;
    api.start(port);
}   

main();