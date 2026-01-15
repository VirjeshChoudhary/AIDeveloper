import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [ 6, 'Email must be at least 6 characters long' ],
        maxLength: [ 50, 'Email must not be longer than 50 characters' ]
    },

    password: {
        type: String,
        select: false,
        required:true
    }
});

userSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password=await bcryptjs.hash(this.password,10);
    next();
})

userSchema.methods.comparePassword=async function (password) {
    return await bcryptjs.compare(password,this.password);
}

userSchema.methods.generateAuthToken=function() {
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRY })
    return token;
}

const User=mongoose.model('User',userSchema);
export default User;