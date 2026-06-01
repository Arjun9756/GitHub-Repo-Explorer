const express = require('express')
const cors = require('cors')
const githubRoutes = require('./Routes/Github.Route')
const errorHandler = require('./MiddleWares/ErroHandler')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:process.env.FRONTEND_URL || "*",
    methods:["GET" , "POST" , "OPTIONS" , "PUT" , "PATCH"],
    allowedHeaders:["Content-Type" , "Authorization"],
    preflightContinue:false,
    optionsSuccessStatus:204
}))

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API is running"
    });
});

app.get('/health' , function(req,res,next){
    return res.status(200).json({
        status:true,
        message:"Server is Running"
    })
})

app.use('/api/github', githubRoutes)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`
    })
})

app.use(errorHandler)
module.exports = app