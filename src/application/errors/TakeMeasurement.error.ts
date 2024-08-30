export namespace TakeMeasurementError {
    export class MeasureAlreadyExists extends Error {
        private _errorCode: string;
        private _errorDescription: string;
        private _statusCode: number = 409;
    
        constructor(){
            let description = "Leitura do mês já realizada";
            let errorCode = "DOUBLE_REPORT";
            super(description);
            this._errorDescription = description;
            this._errorCode = errorCode;    
        }
    
        get errorDescription(){
            return this._errorDescription;
        }
    
        get errorCode(){
            return this._errorCode;
        }
        
        get statusCode(){
            return this._statusCode;
        }
    }
}
