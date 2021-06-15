const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
var cors = require('cors');
const Cors = require("cors");
const youtubedl = require('youtube-dl-exec')
//const app=express().use('*', cors());
//
//const bodyParser = require("body-parser");

const app = express();
//app.use(requireHTTPS)
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
// process.on('unhandledRejection', (err) => { throw err; });
var Datastore = require('nedb');
//app.use("/getsubtitles");
//app.use("dropdatabase");
//app.use("/droprecord");
//app.use("/addtopic");
// app.use("/populatetopic");

//app.listen(7000 , "dev.citynet.net"|"45.76.18.92", () =>console.log('listening at 7000'));
//app.listen(7000 , "dev.citynet.net", () =>console.log('listening at 7000'));
app.use(express.static('public', cors()));
app.use(express.static('public/data', cors()));
app.use(express.static('http://127.0.0.1:7001/' + '/public', cors()));
app.use(express.static('http://localhost:700' + '/public', cors()));
////app.use(express.static('public',cors()));
////app.use(express.static('public/data',cors()));
//app.use(express.static('http://127.0.0.1:7000/'+ '/public',cors()));
////app.use(express.static('http://localhost:7000'+ '/public',cors()));
app.use(express.json({ limit: '10mb' }));
//app.listen(7000 , "dev.citynet.net"|"45.76.18.92", () =>console.log('listening at 7000'));
app.listen(7000, "dev.citynet.net" | "localhost", () => console.log('listening at 7000'));
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
//const { link } = require('fs');
app.get('/getsubtitles', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});


app.post('/getsubtitles', cors(), (request1, response) => {
  //beginning of new function 
  //let Yserial = "";
  //let topic = "";
  link1 = request1.body.Yserial;
  //link = request1.body.topicsSelect;
  console.log("link = " + link1)

  getFile(link1)
})

function getFile() {
  youtubedl(link1, {
    // dumpSingleJson: true,
    skipDownload: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
    writeAutoSub: true,
    writeSub: true,
    referer: link1
  })

    .then(output => {
      //This portion forms the file name so the application can read the file from the directory
      outputSplit = output.toString().split(']').join().split(":").join().split(" ")
      // console.log(outputSplit) //this is the file name 
      content = ""
      for (i = 8; i < outputSplit.length; i++) {
        content = content + outputSplit[i]
        if (i < outputSplit.length - 1) {
          content = content + " "
        }
      }
      console.log("content = " + content)
    })
    .then(() => {

      var contentFile = fs.readFileSync(content, 'utf-8')//.toString()
      let runLength = 10
      let text1 = "fake"
      let dur = 0
      var contentSplit = []
      //MarkUp is an array that markup relating to the timestamp can be placed so that the text can be extracted from it
      var markUp = ['position:', '<i>', '</i>', '&gt;&gt;', 'size:', 'line:', '<c>']
      contentSplit = contentFile.toString().split(" ").join().split("\n").join().split(",")
      for (i = 0; i < contentSplit.length; i++) {
        //  console.log(i + " <---- i  :  content --> " + contentSplit[i])
      }

      for (i = 0; i < contentSplit.length - 17; i++) {//this really needs to be checked again
        var res = contentSplit[i].substring(0, 2);
        var res2 = contentSplit[i + 2].substring(0, 2);
        var text = ""

        if (res == "00" && res2 == "00") {
          // let Zserial = []
          var hms1 = contentSplit[i].substring(0, 8).split(":")
          var hms2 = contentSplit[i + 2].substring(0, 8).split(":")

          // the two lines below allow us to set the clock properly
          if (hms2[2] == "00") {
            hms2[2] = "60"
          }
          var integer1 = parseInt(hms1[2], 10);
          var integer2 = parseInt(hms2[2], 10);
          var secondsDuration = integer2 - integer1
          // the two lines below adjust the time addition to get the proper time 
          if (secondsDuration < 0) {
            secondsDuration = 60 - (secondsDuration * -1)
          }
          //create the phrase that is between the time stamps
          if (runLength + i > contentSplit.length) { //-1) {
            runLength = contentSplit.length //- i
          }
          // this is where we can strip out stuff regarding the markup for the closed captioning. 
          for (ii = i + 4; ii < i + runLength + 4; ii++) { //this line is incrredibly important to tweak if you are getting weird results
            //   console.log(ii + " " + contentSplit.length)
            //  console.log(contentSplit[ii].substring(0, 2))
            if (contentSplit[ii] == undefined) {
              console.log(contentSplit[ii])
            } else { var endText = contentSplit[ii].substring(0, 2); }
            if (endText == "00" || endText == undefined) {
              break
            }
            let trigger = true;
            for (iii = 0; iii < markUp.length; iii++) {
              if (contentSplit[ii] == undefined) {
                console.log(contentSplit[ii])
              } else {
                if (contentSplit[ii].includes(markUp[iii])) {
                  trigger = false
                }
              }
            }
            if (trigger == true && contentSplit != undefined) {
              text += contentSplit[ii] + " "
            }
          }
          text = text.trim()
          var startRaw = contentSplit[i].substring(0, 8)
          var startSplit = startRaw.split(":")
          var start = Number(startSplit[0] * 3600) + Number(startSplit[1] * 60) + Number(startSplit[2])
          console.log(start)
          if (secondsDuration == 0 || text1 == text || text == 'undefined') {
          } else {
            var captions1 = StartDurText.captions;
            var obj = { start: String(start), dur: String(secondsDuration), text: text };
            captions1.push(obj);

            text1 = text
          }
        }
      }
      let linkID = link1.split("=")
      var captions = captions1.slice(1)
      captions.push(linkID[1])
      // console.log(captions)
      //console.log(startSplit)
      database.insert({ captions });
      fs.unlink(content, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        console.log('File deleted!');
      });
    })
    .then(() => {
      //need to delete the contents of the object here? I think this is working! -- This seems to work really well at the moment!
      for (const prop of Object.getOwnPropertyNames(StartDurText)) {
        delete StartDurText[prop];
      }
    })
  var StartDurText = {
    captions: [{
      start: "start",
      dur: "dur",
      text: "text"
    }]
  }
  return

}
var StartDurText = {
  captions: [{
    start: "start",
    dur: "dur",
    text: "text"
  }]
}

//end of new function 

//below is the function to remove the database totally.  
app.post('/dropdatabase', cors(), (request1, response) => {
  console.log('DROPPING DATABASE')
  database.remove({}, { multi: true }, function (err, numRemoved) {
    database.loadDatabase(function (err) {
      // done
    });
  });
})

app.post('/droprecord', cors(), (request1, response) => {

  let currentRecord = "";
  currentRecord = (request1.body.data);
  console.log('currentRecord =' + currentRecord);
  database.remove({ _id: currentRecord }, {}, function (err, numRemoved) {

    console.log('DROPPED RECORD');
  })
  database.persistence.compactDatafile();
  response.json('dropped record');
});
//Below is the function to add a topic
app.post('/addtopic', cors(), (request1, response) => {
  let currentRecord = "";
  currentRecord = request1.body.Eserial;
  console.log('current Record = ' + currentRecord);
  topiclist.insert({ currentRecord }, function (err, currentRecord) {
    console.log('ADDED RECORD');
    let data = JSON.stringify(currentRecord);
    response.send(data);
    topiclist.persistence.compactDatafile()
  })
  //return (null, currentRecord);

})
//below is the populate topic function 
app.get('/populatetopic', cors(), (request, response) => {
  console.log('inside the populate topic function in here to post the video');
  let currentRecord = "";
  currentRecord = request.body.data;

  topiclist.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    } else {
      response.send(data);
      console.log('DATA = ' + data) //take this out to get rid of the long console.log when you post a video
    }//response = data;
    //database.count({}, function (err, count) {
    //response.end();
    //console.log('Count = '+ database.count );})
  });
});

 // })
   // });