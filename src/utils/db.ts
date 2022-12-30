import mongoose from "mongoose";
import config from "config";

export async function connect(){
    try {
        await mongoose.connect(config.get<string>('dbUri'))
        console.log('connected to db')
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}