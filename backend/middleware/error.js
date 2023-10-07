const ErrorHandler= require("../utils/errorHandler");

module.exports= (err,req,res,next)=>{
      err.statusCode= err.statusCode|| 500;
      err.message=err.message||"Internal Server Error";


       if(err.code==1100)
       {
        const message=`Duplicate ${object.keys(err.keyValue)} Entered`
        err= new ErrorHandler(message,400);
       }
// wrong jwt token
       if(err.name=="JsonwebTokenError")
       {
        const message="Invalid Json web token ! try again."
        err= new ErrorHandler(message,400);
       }

// jwt token Expire
if(err.name=="JsonwebTokenExpire")
{
 const message=" Json web token Expired ! try again."
 err= new ErrorHandler(message,400);
}

      res.status(err.statusCode).json({
        success:false,
        message:err.message
      });
}