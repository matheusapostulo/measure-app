import Measure from "../../domain/Measure";

export default interface MeasureRepositoryProtocol {
    saveMeasure(measure: Measure): Promise<void>;
}