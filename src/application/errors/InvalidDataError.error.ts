export default class InvalidDataError extends Error {
    private _errorCode: string;
    private _errorDescription: string;
    private _statusCode: number = 400;

    constructor(description: string){
        let errorCode = "INVALID_DATA";
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

