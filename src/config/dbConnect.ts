import * as mongoose from "mongoose";


const dbConnect = async ()=>{
    try{
        const conn = await  mongoose.connect(process.env.SERVER_URL_MONGO as string)
        console.log(`database is connected : ${conn.connection.host}`)

    }catch(error){
        console.log({error:"database failed connection "})
    }
}

export default dbConnect