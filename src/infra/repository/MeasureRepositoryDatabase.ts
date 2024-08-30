import MeasureRepositoryProtocol from '../../application/repository/MeasureRepositoryProtocol';
import DatabaseConnection from '../../application/protocols/database/DatabaseConnection';
import Measure from '../../domain/Measure';

export default class MeasureRepositoryDatabase implements MeasureRepositoryProtocol {
    constructor(readonly connection: DatabaseConnection){
    }

    async saveMeasure(measure: Measure){
        await this.connection.saveMeasure(measure);
    }

    async getMeasure(id: string): Promise<Measure> {
        const measure = await this.connection.findUnique(id);
        // If the model doesn't exist, return model that is equal null
        if(!measure){
            return measure;
        }
        // Here we'll abstract the database model to the domain model
        return new Measure(measure._id, measure.value, measure.customer_code, measure.measure_datetime, measure.measure_type, measure.has_confirmed, measure.image_url);
    }

    async updateMeasure(measure: Measure){
        await this.connection.updateMeasure(measure);
    }
}