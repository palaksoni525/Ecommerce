const app= require('./app');

import cloudinary from "cloudinary";
const dotenv= require("dotenv");


const connectDatabase= require('./config/database');
dotenv.config({path:'backend/config/config.env'});

connectDatabase();
cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
app.listen(process.env.PORT,()=>{
      console.log(`server is working on port http://localhost: ${process.env.PORT}`)
})