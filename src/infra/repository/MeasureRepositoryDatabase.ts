import MeasureRepositoryProtocol from '../../application/repository/MeasureRepositoryProtocol';
import DatabaseConnection from '../../application/protocols/database/DatabaseConnection';
import Measure from '../../domain/Measure';

export default class MeasureRepositoryDatabase implements MeasureRepositoryProtocol {
    constructor(readonly connection: DatabaseConnection){
    }

    async saveMeasure(measure: Measure){
        await this.connection.saveMeasure(measure);
    }
}