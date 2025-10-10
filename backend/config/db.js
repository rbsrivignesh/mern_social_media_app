import mongoose from "mongoose";

const connectDB= async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(db.connection.host);
        console.log(db.connection.name);
        
    } catch (error) {
        console.log("DB error ",error)
    }
}


export default connectDB;