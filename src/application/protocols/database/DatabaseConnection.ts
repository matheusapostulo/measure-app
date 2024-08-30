export default interface DatabaseConnection {
    saveMeasure(entity: any): Promise<void>;
    findMeasuresByDate(customerCode: string,measureType: string): Promise<any[]>;
    isConnectionOpen(): boolean;
    close(): Promise<void>;
}