export namespace ConfirmMeasurementError {
    export class NotFoundError extends Error {
        private _errorCode: string;
        private _errorDescription: string;
        private _statusCode: number = 404;
    
        constructor(){
            let errorCode = "MEASURE_NOT_FOUND";
            let description = "Leitura não encontrada";
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

    export class AlreadyConfirmedError extends Error {
        private _errorCode: string;
        private _errorDescription: string;
        private _statusCode: number = 409;
    
        constructor(){
            let errorCode = "CONFIRMATION_DUPLICATE";
            let description = "Leitura do mês já confirmada";
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
