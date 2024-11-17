import mongoose, { mongo } from "mongoose";

const connectDB = async ()=>{
     try{
        console.log('working  connectDB')
        
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/Submission-Portal', {});


       
     }catch(error){
        console.error(`Error: ${error.message}`);
        process.exit(1)
     }
}    
 export default connectDB