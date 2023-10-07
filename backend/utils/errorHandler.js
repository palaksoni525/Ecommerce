class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        message=this.messagemessage;
        
        this.statusCode=statusCode;
        Error.captureStackTrace(this,this.constructor);

    }
}
module.exports= ErrorHandler;