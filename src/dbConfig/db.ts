import mongoose from "mongoose";

export async function connect(){
    try {
        mongoose.connect(process.env.DATABASE_URl!)
        const connection = mongoose.connection    
        connection.on('connected',() =>{
            console.log("Database connected successfully")
        })

        connection.on('error',(err) =>{
            console.log('mongobd connection error. Please make sure to check the db string or databse is running' + err)
            process.exit()
        })
    } catch (error) {
        console.log("issue through conncecting the databse");
        console.error(error)
    }
}