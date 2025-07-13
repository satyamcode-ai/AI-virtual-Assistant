import mongoose from "mongoose";

// Mongoose (a popular ODM - Object Data Modeling library for MongoDB and Node.js), you define a schema to enforce a structure.

// Schema defines the structure of documents in a collection

// A Model is a wrapper around a schema. It provides an interface to interact with the database — for CRUD operations.

// User.find();                 // read all users
// User.create({...});          // create a user       ------> CRUD
// User.updateOne();            // update
// User.deleteOne();            // delete

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    },
    assistantName:{
        type : String 
    },
    assistantImage:{
        type : String 
    },
    history:[
        {type : String}
    ]
},{timestamps:true})

const User = mongoose.model("User",userSchema)
export default User