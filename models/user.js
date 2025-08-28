const mongoose =  require("mongoose");
const { boolean } = require("webidl-conversions");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  aadharCardNumber:{
    type:Number,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  mobile:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["voter","admin"],
    default:"voter"
  },
  isVoted:{
    type:Boolean,
    default:false
  }
});

userSchema.pre('save', async function(next){
  const user  = this
   if(!user.isModified('password')) return next();

   try{
    const salt = await bcrypt.genSalt(10);

    const hashedpassword = await bcrypt.hash(user.password,salt);

    user.password = hashedpassword
    next();
   }catch(err){
    return next(err);
   }
})

userSchema.methods.comparePassword = async function(canddidatePassword){
  try{
     const isMatch =  await bcrypt.compare(canddidatePassword,this.password);
     return isMatch;
  }catch(err){
     throw err;
  }
}

const user = mongoose.model("user",userSchema);

module.exports = user;