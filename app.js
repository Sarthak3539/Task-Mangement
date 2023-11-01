const express=require('express')
const bodyparse =require("body-parser")
const mongoose=require('mongoose')
const app=express()
const port=4000
const connectDB=require('./db/connectdb')
//const {create_task}=require('./controller/tasks')
const tasks=require('./db/schema')
const cors=require('cors')

console.clear()
app.use(cors())
app.use(express.json())
app.use(bodyparse.json())
app.use(bodyparse.urlencoded({ extended: true }))


const salt = "499b76bb1df1d79938bea87b41b2bc71"
const { randomBytes, scryptSync } = require('crypto')
const user = require('./db/user_model')


//home 
app.get("/",(req,res)=>{
    res.sendFile("D:/NODE_PROJECT/to-do/pages/index.html")
    
})



// register and login


app.get('/register', (req, res) => {
    res.sendFile("D:/NODE_PROJECT/to-do/pages/register.html")

})


app.post('/data', (req, res, next) => {
    console.log(req.body)


    const cryptpassword = () => {
        const hashedpassword = scryptSync(req.body.password, salt, 64).toString('hex');
        req.body.password = hashedpassword
    }

    cryptpassword()


    const userdata = new user(
        req.body
    )

    userdata.save()
    res.redirect('/login')
    next()
})

app.get('/login', (req, res) => {
    res.sendFile("D:/NODE_PROJECT/to-do/pages/login.html")
})


app.post('/login_data', async (req, res, next) => {
     console.log(req.body);
    const doc = await user.findOne({ email: req.body.email })
    if(!doc){
        res.send("password is not matched");
    }
    const actual_password = doc.password
    var enter_password = req.body.password
    const cryptpassword = () => {
        const hashedpassword = scryptSync(enter_password, salt, 64).toString('hex');
        enter_password = hashedpassword
    }
    cryptpassword()
    console.log(actual_password)
    console.log(enter_password)

    if (enter_password == actual_password) {
        
        res.json({email:req.body.email});
  
    }
    else {
        res.json({"message":"password is not matched"});
    }

})

/////////////////////////////////////////////////////////////////////////////////




// create task

app.get('/tm/create_task',(req,res)=>{
    res.sendFile("D:/NODE_PROJECT/to-do/pages/create_task.html")
})

// create task data 
app.post('/tm/create_task/data',(req,res)=>{
    console.log(req.body)
  

    const newtask = new tasks(
      {
        "name":req.body.name,
        "priority":req.body.priority,
        "email":req.body.email,
      }
    )

    newtask.save()

    
      res.send(newtask)
})


// delete one task

app.get('/tm/delete_task',(req,res)=>{
    res.sendFile("D:/NODE_PROJECT/to-do/pages/delete_task.html")
})

// delete task data
app.post('/tm/delete_task/data',async(req,res)=>{
  const task=await tasks.findOneAndDelete(
        { "name" : req.body.name,"email":req.body.email }
     )
   console.log(req.body.name)
     if(task){
        res.send("task deleted sucessfuly")
     }
     else{
        res.send("task does not exist")
     }
  
})



// get all tasks
app.get('/tm/all_task',(req,res)=>{
    res.sendFile("D:/NODE_PROJECT/to-do/pages/all_task.html")
})


// send  all tasks data to frontend
app.get('/tm/all-task/data',async(req,res)=>{
    const alltask=await tasks.find({email:req.query.email});


     if(alltask){
         console.log(alltask)
         res.json(alltask)
        }
        else{
            res.send("no task is their")
        }
       
})




// find task
app.get('/tm/find_task',(req,res)=>{
    res.sendFile("D:/NODE_PROJECT/to-do/pages/find_task.html")
})

// find task data

app.post('/tm/find_task/data',async(req,res)=>{
    console.log(req.body)
        const task= await tasks.findOne(
            { "name" : req.body.name,"email":req.body.email }
            )
            if(task){
                //res.send("task found")
                res.send(task);
            }
            else{
                res.send("task not found himanshu")
            }
      
})
    


// update task

app.get('/tm/update_task',(req,res)=>{
    res.sendFile("D:/NODE_PROJECT/to-do/pages/update_task.html")
})

// update task data

app.post('/tm/update_task/data',async(req,res)=>{
    try {
        let doc = await tasks.findOneAndUpdate({name:req.body.old_name,email:req.body.email}, {name:req.body.name,priority:req.body.priority});

    if(doc){
       console.log("updated sucessfuly")
       res.send("task sucessfuly")
    }
    else{
        console.log("not updated")
        res.send("task doesnot exist")
    } 
    } catch (error) {
        res.send(error.message);
    }
//  console.log(filter,priority)

})



const start=async()=>{
   await connectDB()
    app.listen(port,()=>{
        console.log(`server is listning on ${port}`)
    })  
}

start()
