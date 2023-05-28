
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3500;
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/logError');


const app = express();




app.use(logger);

const whiteList = ['https://www.google1.com','http://localhost:3500','http://127.0.0.1:5500'];

const corsOptions = {
    origin : function(origin,callback){
        if(whiteList.indexOf(origin)!==-1 || !origin){
            callback(null,true);
        }
        else{
            callback(new Error('Not allowed by mukunth cors'));
        }
    },
   // optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname,'/public'
)));




app.get('^/$|/index(.html)?',(req,res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
})


app.get('/new-page(.html)?',(req,res) => {
    res.sendFile(path.join(__dirname,'views','new-page.html'));
})

app.get('/old-page(.html)?',(req,res) => {
    res.redirect(301,'/new-page'); //302 by default
}) 

//chaining of route-handler

app.get('/hello(.html)?',(req,res,next) => {
    console.log("attempted to get hello.html")
    res.contentType('application/json');
    next();
    
},(req,res) => {
  res.send({msg : 'Hello Mukunthan!'});

})

const one = (req,res,next) => {
    console.log("One");
    next();
}
const two = (req,res,next) => {
    console.log("two");
    next();
}
const three = (req,res,next) => {
    res.send("Finished")
}

app.get('/chain(.html)?',[one,two,three]);




app.all('*',(req,res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.send({error : '404 not found'})

    }
    else{
        res.type('txt').send('404 not found ');
    }
    
})


app.use(errorHandler);



app.listen(PORT, () => console.log(`Server running in port ${PORT}`));