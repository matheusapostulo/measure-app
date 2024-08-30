export namespace AppError {
    export class UnexpectedError extends Error {
        private _errorDescription: string;
        private _statusCode: number = 500;

        constructor(){
            let description = "Internal Server Error";
            super(description);
            this._errorDescription = description;
        }

        get errorDescription(){
            return this._errorDescription;
        }
        
        get statusCode(){
            return this._statusCode;
        }
    }
}
