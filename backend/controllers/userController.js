const ApiFeatures = require("../utils/apiFeatures");
const User= require("../models/userModel");
const ErrorHandler= require("../utils/errorHandler");
const bcrypt= require("bcryptjs");
const sendToken = require("../utils/jwtToken");
const sendEmail= require("../utils/sendEmail.js");
const crypto= require("crypto");
const mongoose= require("mongoose");
exports.RegisterUser= async(req,res,next)=>{
       const{name,email,password}=req.body;

       const user= await User.create({
        name,email,password,
        avatar:{
            public_id:"this is sample id",
            url:"profileurl"
        }
       });
    //    const token= user.getJWTToken();
    //    res.status(201).json({
    //     success:true,
    //     token
    //    })
    sendToken(user,200,res);
       
}

exports.loginUser = async (req, res, next) => {

  console.log("login User");
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
   console.log(email);

  const user = await User.findOne({ email }).select("+password");
   console.log(user);
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }


  const isPasswordMatched = await user.comparePassword(password);


  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
};
exports.logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
   
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token

  const resetToken =  user.getResetPasswordToken();


  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
      
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
   console.log("send Email");
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
};
exports.resetPassword = async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
};

//get user details
exports.getUserDetails= async(req,res,next)=>{
        console.log(req);
       const user=await  User.findById(req.user.id);
        if(!user)
        {
          return ;
        }
        return res.status(200).json({
          success:true,
          user
        })
}
exports.updatePassword = async(req,res,next)=>{

    console.log(req.user.id);
    //const user =  User.findOne(req.user.id);
      const user = await User.findOne({id:req.user.id }).select("+password");
    // const user=  User.findById( new mongoose.Types.ObjectId(req.user.id)
     const isPasswordMatched = await user.comparePassword(req.body.oldpassword);
     

     if (!isPasswordMatched) {
       return next(new ErrorHandler("oldPassword is incorrect", 400));
     } 
     if(req.body.newPassword!= req.body.confirmPassword)
     {
      return next(new ErrorHandler("Please enter same Password", 400));
     }
     user.password= req.boody.newPassword;
     await user.save();
     sendToken(user,200,res);

}
exports.updateProfile=  async(req,res,next)=>{

   console.log("updateProfile");
   console.log(req.user.name);
   console.log(req.user.email);

     const newUserData={
      name:req.body.name,
      email:req.body.email
     }

     //will add cloudinary

     const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new :true,
        runValidators:true,
        useFindAndModify:false

     });
     return res.status(200).json({
      success:true,
    });

}
// get All users -->{admin}
exports.getAllUsers= async(req,res,next)=>{
    const users= await User.find();
    res.status(200).json({
      success:true,
      users
    })
}

//get single user with given id

exports.getSingleUser= async(req,res,next)=>{
  const user= await User.findById(req.params.id);

   if(!user)
   {
    return next(new ErrorHandler(`user does'nt exist with id :${req.params.id}`));
   }
  res.status(200).json({
    success:true,
    user
  })
}
  

//UPDATE USER ROLE
exports.updateUserRole=  async(req,res,next)=>{
    const newUserData={
     name:req.body.name,
     email:req.body.email,
     role:req.body.role
    }

    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
       new :true,
       runValidators:true,
       useFindAndModify:false

    });
    return res.status(200).json({
     success:true,
   });

}
//DELETE USER -->ADMIN

exports.deleteUser=  async(req,res,next)=>{

 

    //will  remove add cloudinary

    const user= User.findById(req.params.id);
      if(!user)
      {
         return next(new ErrorHandler("User doesn't exist"));
      }
      await user.deleteOne();
    return res.status(200).json({
     success:true,
     message:"User deleted Successfully"
   });

}




     