import Measure from "../../domain/Measure";

export default interface MeasureRepositoryProtocol {
    saveMeasure(measure: Measure): Promise<void>;
    getMeasure(id: string): Promise<any>;
    updateMeasure(measure: Measure): Promise<void>;
}