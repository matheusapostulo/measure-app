export default interface DatabaseConnection {
    saveMeasure(entity: any): Promise<void>;
    findMeasuresByCustomerCodeAndType(customerCode: string, measureType: string): Promise<any[]>;
    findMeasuresByCustomerCode(customerCode: string): Promise<any[]>;
    findUnique(id: string): Promise<any>;
    updateMeasure(entity: any): Promise<any>;
    isConnectionOpen(): boolean;
    close(): Promise<void>;
}