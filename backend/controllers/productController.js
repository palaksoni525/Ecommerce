const Product= require("../models/productModel");
const ApiFeatures = require("../utils/apiFeatures");
const ErrorHandler= require("../utils/errorHandler");


exports.createProduct= async(req,res,next)=>{ 
      const product= new Product(req.body);
      product.save({validateBeforeSave:false});
      return res.status(201).json({
           success:true,
           product
      });
};
  

exports.getAllProducts=  async (req,res) =>{

     const resultPerPage=5;
     const productCount= await Product.countDocuments();
    const apiFeature= new ApiFeatures(Product.find(),req.query) 
    .search()
    .filter()

    // let products= await apiFeature.query;

    // let filteredProductsCount=products.length;

  .pagination(resultPerPage);
    const products= await apiFeature.query;
   
    res.status(200).json({
        success:true,
       products,
    productCount,
    resultPerPage
    //filteredProductsCount
  });
}
exports.updateProduct= async(req,res,next)=>{
      
       let product=await Product.findById(req.params.id);
       if(!product)
       {
        return  next(new ErrorHandler("Product Not Found",404));

        }
       

       product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new :true,
        runValidators:true,
        useFindAndModify:false
       })

       res.status(200).json({
        success:true,
        product
       })
}

exports.deleteProduct= async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product)
    {
     return res.status(500).json({
         success:false,
         message:"Product not Found"

     })
    }

     await product.deleteOne();

    res.status(200).json({
     success:true,
     message:"Product deleted successfully"
    })
}
//GET PRODUCT DETAILS
exports.getProductDetails= async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product)
    {
     return res.status(500).json({
         success:false,
         message:"Product not Found"

     })
    }

    res.status(200).json({
     success:true,
     product
    })
}
//CREATE NEW REVIEW OR UPDATE REVIEW

exports.createProductReview =async (req, res, next) => {

    console.log("ProductReview");
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.ratings = rating), (rev.comments = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.ratings;
    });
  
    product.ratings = avg / product.reviews.length;
     console.log(product.ratings);
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  };
  //GET ALL REVIEWS OF PRODUCT

  exports.getProductReviews= async(req,res,next)=>{
        const product=  await Product.findById(req.query.id);
       if(!product)
       {
        return next(new ErrorHandler("Product doesnot exsist"));
       }
        res.status(200).json({
          succcess:true,
         reviews: product.reviews
        });

  }


   //DELETE REVIEWS OF PRODUCT

   exports.deleteReview =async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  };