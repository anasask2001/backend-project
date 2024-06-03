import mongoose from 'mongoose'

//connecting mongodb
const connectDB = async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGODB_connect,{
            
          

        })
        console.log(`mongodb connected : ${db.connection.host}`);
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
 

export default connectDB