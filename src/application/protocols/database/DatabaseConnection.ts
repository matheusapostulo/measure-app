export default interface DatabaseConnection {
    saveMeasure(entity: any): Promise<void>;
    close(): Promise<void>;
}