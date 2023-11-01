const mongoose=require('mongoose')

const taskschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    priority:{
        type:Number,
        default:0
    },
    completed:{
        type:Boolean,
        default: false
    },
    email:{
        type:String,
        required:true
    }
})


module.exports=mongoose.model("tasks",taskschema)
