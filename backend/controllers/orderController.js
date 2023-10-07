const Order= require("../models/orderModel");
const Product=require("../models/productModel");
const User= require("../models/userModel");
const ErrorHandler= require("../utils/errorHandler");
 

//create  new product order
exports.newOrder= async(req,res,next)=>{
    // const{
    //     shippingInfo,
    //     orderItems,
    //     paymentInfo,
    //     itemsPrice,
    //     shippingPrice,
    //     taxPrice,
    //     totalPrice}= req.body

    //     const order=  await Order.create({
    //    shippingInfo,
    //     orderItems,
    //     paymentInfo,
    //     itemsPrice,
    //     shippingPrice,
    //     taxPrice,
    //     totalPrice,
    //     paidAt:Date.now(),
    //     user:req.user._id
    //     })

    const order= await new Order(req.body);
      order.user= req.user.id;
    await order.save({ validateBeforeSave: false });
       // await order.save({validateBeforeSave:true});
       res.status(201).json({
        success:true,
        order
       })
}

exports.getSingleOrder= async(req,res,next)=>{
      const order=await  Order.findById(req.params.id).populate("user","name email");


      if(!order)
      {return next(new ErrorHandler("order doesn't exsist with this id",404))}


      return res.status(201).json({
          success:true,
          order
      })

}
//GET LOGGED IN USER ORDERS
exports.myOrders =async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
  };

  exports.getAllOrders =async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount=0;
     orders.forEach((order)=>
     totalAmount= totalAmount+ order.totalPrice);
    res.status(200).json({
      success: true,
      orders,
      totalAmount
    });
  };

  //update order status

  exports.updateOrder =async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order)
    {return next(new ErrorHandler("order doesn't exsist with this id",404))}
    if(order.status=="Delivered")
      {
        return next(new ErrorHandler("you have already deliverd the product",400));
      }
     order.orderItems.forEach(async(order)=>
         {
             await updateStock(order.product,order.quantity);
         })
         console.log(order.paymentInfo.orderStatus);

         console.log(order.orderStatus);
         console.log(req.body.status);

         order.paymentInfo.orderStatus= req.body.status;


         if(req.body.status=="Delivered")
         {
             order.deliveredAt=Date.now()
         }

         await order.save({validateBeforeSave:false});

         res.status(200).json({
            success: true,
          });


}
async function updateStock(id,quantity){
      const product= await Product.findById(id);
       product.stock= product.stock-quantity;

    await   product.save({validateBeforeSave:false});

}

exports.deleteOrder =async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if(!order)
    {return next(new ErrorHandler("order doesn't exsist with this id",404))}
    res.status(200).json({
      success: true,
    });
  };
     


