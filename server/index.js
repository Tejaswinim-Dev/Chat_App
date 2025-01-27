const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.routes')

const app = express();

require('dotenv').config();

//Middlewares
app.use(cors());// Enable cross-origin requests
app.use(express.json()); // This middleware ensures that req.body is parsed as JSON

app.use('/api/auth',userRoute)



mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB is connected successfully")
}).catch((err)=>{
    console.log("DB connection failed:",err.message)
});

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is started on port ${process.env.PORT}`)
})
