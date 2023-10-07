

const nodemailer= require("nodemailer");
const ErrorHandler= require("../utils/errorHandler");
const sendEmail= async(options)=>{
   
    const transporter = nodemailer.createTransport({
        service:'gmail',
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        auth:{
        user:'psonilnct@gmail.com',
        pass:'gedehspxvhjfuwih'
        }

      });
    
    const mailOptions={
        from:'psonilnct@gmail.com',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    
     transporter.sendMail(mailOptions,function(err){
           if(err)
           {
            new ErrorHandler("Email cannot be sent",201);
           }
           else
           console.log("send Email");
     });
    


}

module.exports= sendEmail;