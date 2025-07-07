import mongoose from 'mongoose';

const dbConnection=(req,res)=>{
    mongoose.connect(process.env.MONGOURI)
    .then(()=>{
        console.log('DB CONNECTED')
    })
    .catch((err)=>{
        console.log("DB CONNECTION ISSUE",err);
    })
}

export default dbConnection;