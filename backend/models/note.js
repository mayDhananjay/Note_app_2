import mongoose from "mongoose";


const noteSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
},({timestamps:true}));

const Note =mongoose.model("Note",noteSchema);

export default Note;