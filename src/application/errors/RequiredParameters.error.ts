export default class RequiredParametersError extends Error {
    private _errorCode: string;
    private _errorDescription: string;
    private _statusCode: number = 400;

    constructor(parameter: string){
        let description = `Parameter '${parameter}' is required`;
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

