const http = require('http');
const fs = require('fs')
// legacy code; 
// const url = require('url');
// const querystring = require('querystring');
const figlet = require('figlet')
const PORT = 8000;

const server = http.createServer((req, res) => {
  
    // source: https://stackoverflow.com/questions/59375013/node-legacy-url-parse-deprecated-what-to-use-instead
  const baseURL = req.protocol + '://' + req.headers.host + '/';
  const reqURL = new URL(req.url, baseURL);
  const page = reqURL.pathname;
  const params = Object.fromEntries(reqURL.searchParams);

  // legacy code: 
  // const page = url.parse(req.url).pathname;
  // const params = querystring.parse(url.parse(req.url).query);
  console.log(page);



  // Main page
  if (page === '/') {
    fs.readFile('index.html', function(err, data) {
    if(err) {
        console.log(err);
        console.log("Could not load main page html.");
        console.log(typeof err);
        let status;
        if(err.code === 'ENOENT') {
            status = 425;
        } else {
            status = 504;
        }
        res.writeHead(status, "Could not load main page HTML");
        res.end();
        return;
    }
    res.writeHead(200, {'Content-Type': 'text/html'});
    console.log()
    res.write(data);
    res.end();
    });
  } // main page end
  // Stylesheet 
  else if (page == '/style.css'){
    fs.readFile('./style.css', function(err, data) {
      if(err) {
        console.log(err);
        console.log('Could not read stylesheet')
        return;
      }
      res.write(data);
      res.end();
    }); // stylesheet end
  }else if (page === '/main.js'){
    fs.readFile('main.js', function(err, data) {
      if(err) {
        console.log("error!");
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write(data);
      res.end();
    });
  } else if (page === '/favicon.png') {
      fs.readFile('./favicon.png', function(err, data) {
          if(err) {
              console.log("Could not load favicon");
              return;
          }
          res.writeHead(200, {'Content-Type': 'image/png'});
          res.write(data);
          res.end();
      })
  }


  //***** COIN FLIP *****//
  else if (page == '/api') {
    if('student' in params){
      if(params['student']== 'play'){
        res.writeHead(200, {'Content-Type': 'application/json'});
        //RPS LOGIC
         let rpsRes = Math.floor(Math.random()*3) == 0 ? 'rock' : Math.floor(Math.random()*3) == 1 ? 'paper' : 'scissors'
        
        const objToJson = {
          name: "leon",
          status: "Boss Man",
          currentOccupation: "Baller",
          rps: rpsRes
        }
        res.end(JSON.stringify(objToJson));
      }//student = leon
      else if(params['student'] != 'play'){
        res.writeHead(200, {'Content-Type': 'application/json'});
        const objToJson = {
          name: "please",
          status: "enter",
          currentOccupation: "play"
        }
        res.end(JSON.stringify(objToJson));
      }//student != leon
    }//student if
  }//else if
  
  else{
    figlet('404!!', function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      console.log("Could not load", page);
      res.write(data);
      res.end();
    });
  }
});

server.listen(PORT);
console.log("Listening on port %d...", PORT)