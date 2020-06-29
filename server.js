const  request  = require('request');
const cheerio = require('cheerio');
const express = require('express');
var cors = require('cors');
const Cors = require("cors");
//const app=express().use('*', cors());
//
//const bodyParser = require("body-parser");

const app = express();
app.use(Cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});
//
//app.use(cors());

var Datastore = require('nedb');
//app.use("/getsubtitles");
//app.use("dropdatabase");
//app.use("/droprecord");
//app.use("/addtopic");
// app.use("/populatetopic");

//app.listen(7000 , "dev.citynet.net"|"45.76.18.92", () =>console.log('listening at 7000'));
//app.listen(7000 , "dev.citynet.net", () =>console.log('listening at 7000'));
app.use(express.static('public',cors()));
app.use(express.static('public/data',cors()));
app.use(express.static('http://127.0.0.1:7000/'+ '/public',cors()));
app.use(express.static('http://localhost:7000'+ '/public',cors()));
////app.use(express.static('public',cors()));
////app.use(express.static('public/data',cors()));
//app.use(express.static('http://127.0.0.1:7000/'+ '/public',cors()));
////app.use(express.static('http://localhost:7000'+ '/public',cors()));
app.use(express.json({limit: '10mb'}));
//app.listen(7000 , "dev.citynet.net"|"45.76.18.92", () =>console.log('listening at 7000'));
app.listen(7000 , "dev.citynet.net"|"localhost", () =>console.log('listening at 7000'));
//const database = new Datastore({filename: __dirname +'database.db', autoload: true});
//const topiclist = new Datastore({filename: __dirname+'topiclist.db', autoload: true});
const database = new Datastore('database.db');
const topiclist = new Datastore('topiclist.db');
topiclist.loadDatabase(function (error) { if (error) { console.log('FATAL: local database could not be loaded. Caused by: ' + error); throw error; } console.log('INFO: local database loaded successfully.'); })
database.loadDatabase(function (error) { if (error) { console.log('FATAL: local database could not be loaded. Caused by: ' + error); throw error; } console.log('INFO: local database loaded successfully.'); })
//topiclist.loadDatabase(); 
//database.loadDatabase();
var http = require('http');
var fs = require('graceful-fs');
app.get('/getsubtitles', (request,response) => {
    database.find({},(err,data)=>{
      if (err){
        response.end();
        return;
      }
      response.json(data);
    });
});


app.post ('/getsubtitles', cors(), (request1,response) =>  {

let Yserial = "";
let topic = "";
Yserial = request1.body.Yserial;
topic = request1.body.topicsSelect;
 let Zserial = Yserial.split("="); //this splits the id from the right hand side of the youtube address
console.log('Zserial[1] = '+Zserial[1]+' topic = '+topic);
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
//const Zserial = Zserial[1];
getSubtitles({
  videoID: Zserial[1], // youtube video id
  lang: 'en' // default: `en`
}).then(function(captions, topic) {
  captions.push(String(Zserial[1]));
  // database.insert({captions},{topic});
   database.insert({captions});
  // database.insert({topic});
   console.log('in here');
});
response.json('finished grabbing timed text')
})


//below is the function to remove the database totally.  
app.post('/dropdatabase', cors(), (request1, response) => {
console.log('DROPPING DATABASE')
  database.remove({ }, { multi: true }, function (err, numRemoved) {
    database.loadDatabase(function (err) {
      // done
    });
  });
})

app.post('/droprecord',  cors(), (request1, response) => {
  
  let currentRecord = "";
  currentRecord = (request1.body.data);
  console.log('currentRecord ='+currentRecord);
  database.remove({ _id: currentRecord }, {}, function (err, numRemoved){

  console.log('DROPPED RECORD');
})
database.persistence.compactDatafile();
response.json('dropped record');
  });

app.post('/addtopic',  cors(), (request1,response) =>{
    let currentRecord = "";
    currentRecord = request1.body.Eserial;
    console.log('current Record = '+ currentRecord);
    topiclist.insert({currentRecord}, function (err, currentRecord){
      console.log('ADDED RECORD');
      let data = JSON.stringify(currentRecord);
      response.send(data);
      topiclist.persistence.compactDatafile()
     })
     //return (null, currentRecord);
    
  })

  app.get('/populatetopic',  cors(), (request,response) => {
  console.log('inside the populate topic function in here to post the video');
    let currentRecord = "";
    currentRecord = request.body.data;
    
      topiclist.find({},(err,data)=>{
        if (err){
          response.end();
          return;
        }else{
      response.send(data);
      //  console.log('DATA = '+ data)
        }//response = data;
       //database.count({}, function (err, count) {
        //response.end();
        //console.log('Count = '+ database.count );})
      });
  });

 // })
   // });