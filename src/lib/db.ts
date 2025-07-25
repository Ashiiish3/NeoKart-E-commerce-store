import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL as string;

if (!MONGODB_URL) {
  throw new Error("Please define MONGO_URL. connect string not found");
}

declare global {
  var mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

const cached = global.mongoose || { conn: null, promise: null };

export async function connectToDB(): Promise<Mongoose | undefined> {
  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URL, {
        bufferCommands: false,
      });
      console.log('database connected');
    }
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
}

// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//     throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// let cached = global.mongoose;

// if (!cached) {
//     cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDb() {
//     if (cached.conn) {
//         return cached.conn;
//     }

//     if (!cached.promise) {
//         const opts = {
//             bufferCommands: false,
//         };

//         cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
//             return mongoose;
//         });
//     }
//     cached.conn = await cached.promise;
//     return cached.conn;
// }

// export default connectDb;

// vivek ka code

// import mongoose from 'mongoose';

// const MONGO_URI = process.env.MONGO_URI ;

// if (!MONGO_URI) {
//   throw new Error("Please define the MONGODB_URI in your .env file");
// }

// let cached = (global).mongoose || { conn: null, promise: null };

// export async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//   try {

//       cached.promise = await mongoose.connect(MONGO_URI, {
//         dbName: 'ecom',
//         bufferCommands: false,
//       });
//       console.log('database connected');

//   } catch (error) {
//     console.log(err:db :${error.message});

//   }
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }
