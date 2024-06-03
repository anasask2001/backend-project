import Joi from "joi";
//Joi Used to validation Product Detiles
const Productjoi = Joi.object({
  ProductTitle: Joi.string(),
  ProductDescription: Joi.string(),
  ProductPrice: Joi.number(),
  ProductImage: Joi.string(),
  ProductCategory: Joi.string(),
});

export default Productjoi;
