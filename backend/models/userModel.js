const mongoose= require("mongoose");
const validator= require("validator");
const { validate } = require("./productModel");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");
const crypto= require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30 , "Please enter less tha 30 characters"],
        minLength:[4, "Please enter more tha 4 characters"]
        
    },
    email:{
        type:String,
        required:[true,"Please enter email"],
        unique:true,
        validate:[validator.isEmail,"Please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minLength:[8,"Password should be greater than 8 character"],
        maxLength:[30,"password should be less than 30 characters"],
        select :false
    },
    avatar:{
        
            
                public_id:{
                    type:String,
                    required:true
        
                },
                url:{
                    type:String,
                    required:true
        
                }
            
        
    },

    role:{
        type:String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire: Date

})   

userSchema.pre("save", async function(next){

    if(!this.isModified("password"))
    {
         next();
    }
    this.password= await bcrypt.hash(this.password,10); 
});

userSchema.methods.getJWTToken= function(){
      return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
      })
}

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };
// userSchema.methods.comparePassword =  (inputPassword) => {
//     try {
//         return bcrypt.compare(inputPassword, this.password);
//     } catch (error) {
//         throw new ErrorHandler("Comparison failed", error);
//     }
// }
userSchema.method.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
  };
module.exports= mongoose.model("User",userSchema);