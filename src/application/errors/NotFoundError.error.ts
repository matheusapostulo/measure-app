export default class NotFoundError extends Error {
    private _errorCode: string;
    private _errorDescription: string;
    private _statusCode: number = 404;

    constructor(description: string){
        let errorCode = "MEASURES_NOT_FOUND";
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

