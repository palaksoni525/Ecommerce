const mongoose= require('mongoose');

const connectDatabase =()=>{
    mongoose.connect("mongodb://127.0.0.1:27017/Ecommerce",{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
            console.log(`mongodb connected to the server: ${data.connection.host}`);
        }).catch((err)=>{
             console.log(err);
        })
}
module.exports= connectDatabase;