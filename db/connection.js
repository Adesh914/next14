import mongoose from "mongoose";

const DATABASE_URL = process.env.MONGODB_URI;

async function connectDB() {
    try {
        await mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
        })
        console.log('db success connect')
    } catch (err) {
        console.log('error connecting to database')
        console.log(err)
        process.exit(1)
    }
}

export default connectDB;