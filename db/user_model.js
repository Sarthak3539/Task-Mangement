const mongoose=require('mongoose')

const userschema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    ph_num:{
       type:Number,
       min: [10, 'Must be at least 10, got {VALUE}'],
       max: 99999999999,
    },
    email:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        required:true,
    }
})  

// b script 




module.exports=mongoose.model("user",userschema)


