const express=require('express');
const morgan=require('morgan');
const MongoClient =require('mongodb').MongoClient;

var app=express();
app.listen(4202,()=>console.log("server is running on 4202"));
app.use(morgan('dev'));

/* app.get('/app.js',(req,res)=>{
    console.log('I am here');
   res.sendFile(__dirname + '/index.html');
}); */
app.use(express.static(__dirname));


let client = new MongoClient('mongodb://localhost:27017',{useNewUrlParser:true})
let connection;
client.connect( (err,conn) =>{
    if(!err){
        connection=conn;
        console.log("database connection establishded");
   }
   else{
       console.log("not established");
   }
});



app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

////get all school names with the district names
app.get('/api/schools',(req,res)=>{
    var collection=connection.db('mongodb-101').collection('blogposts');
       collection.aggregate([
        {$group:{
                _id:'$data.name-of-institution',district: {$addToSet: '$data.district'}}},
         {$project :{"name of school":"$_id","district":"$district",_id:0}}, 
                ]).toArray((err,doc)=>{
            if(!err && doc.length>0){
                   
                        res.send({ status:"true",docs:doc});      
                    }
                    else {
                        console.log('no docs');
                        res.send({ status:"false",docs:doc});           
                    }
                })

         });


   //list the schools,email,postal-address and pincode according to their given district.  
app.get('/api/schools/:district',(req,res)=>
{ var collection=connection.db('mongodb-101').collection('blogposts');
   collection.aggregate([{$match:{'data.district':req.query.district}},
       {$group:{_id:'$data.name-of-institution',email:{$addToSet:'$data.email'},postaladdress:{$addToSet:'$data.postal-address'},pincode:{$addToSet:'$data.pin-code'}}}
   ]).toArray((err,doc)=>{
    if(!err && doc.length>0){
           console.log(doc);
                res.send({ status:"true",docs:doc});      
            }
            else {
                console.log('no docs');
                res.send({ status:"false",docs:doc});           
            }
        })

 });

