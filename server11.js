const  request  = require('request');
const cheerio = require('cheerio');
const express = require('express');
var cors = require('cors');
//let app = express();
const app=express().use('*', cors());
//var cors = require('cors');
app.use(cors());
var Datastore = require('nedb');
app.listen(7000,cors(), () =>console.log('listening at 7000'));
app.use(express.static('public',cors()));
//app.use(express.static('public/data',cors()));
app.use(express.static('http://127.0.0.1:7000/'+ '/public',cors()));
app.use(express.json({limit: '1mb'}));
const database = new Datastore('database.db');
database.loadDatabase();

var http = require('http');
var fs = require('graceful-fs');

app.get('/getsubtitles', cors(), (request,response) => {
    console.log('IN HERE!')
    database.find({},(err,data)=>{
      if (err){
        response.end();
        return;
        
      }
    
      response.json(data);
      console.log('IN HERE!')
    });
});


app.post ('/getsubtitles',cors(), (request1,response) =>  {
let Yserial = "";
 Yserial = request1.body.Yserial;
console.log('Yserial = '+Yserial)
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
gPass = getSubtitles;

getSubtitles({
  videoID: Yserial, // youtube video id
  lang: 'en' // default: `en`
}).then(function(captions) {
   // console.log(captions)
    database.insert({captions});
});
   
})
