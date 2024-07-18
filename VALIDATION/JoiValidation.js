import Joi from "joi";
//Joi used to Validation User Detiles
const UserJoi = Joi.object({
  UserName: Joi.string(),
  Email: Joi.string(),
  Password: Joi.string(),
  ConfirmPassword:Joi.string(),
  ProfileImg:Joi.string()
});

export default UserJoi;
