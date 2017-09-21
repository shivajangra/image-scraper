var express = require('express');
var app = express();  
var fs = require('fs');
var Scraper = require ('images-scraper')
, google = new Scraper.Google();
const download = require('image-downloader');
var databaseConnection      = require('./databaseConnection');
var ObjectID = require('mongodb').ObjectID;
var Jimp = require("jimp");
var port = process.env.PORT || 8000;  
var bodyParser = require('body-parser'); 
 app.use(function(req,res,next){
        res.setHeader('Access-Control-Allow-Origin', "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Origin, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
        res.header("Access-Control-Allow-Credentials", true);
        res.header("X-Frame-Options", "DENY");
        res.header("accept-encoding", "gzip,deflate");
        res.header("Content-Security-Policy", "frame-ancestors 'none'");
        res.header("X-XSS-Protection", "1; mode=block");
        next();
 });
 
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json({limit: '1024kb'}));
app.use(express.static(__dirname + '/public'));  

 /*====st ap=====*/
app.listen(port);	
console.log('Server Running on port ' + port); 	 
app.get('/getsaveRcnSrch',function(req,res){ 
       databaseConnection.db.collection('beforeSearch').find().skip(0).limit(15).toArray(function(err,item){
			 if(item){
				 var resp = {
					data:item,
					message : 'Success',
					responseCode : 200
				  } 
				  res.send(resp);
			 }
	   });
});
 function saveRcnSrch(key,val){ 
			 var document = {
				 keyword:key,
				 url:val
			 }
			 console.log(document);
			 databaseConnection.db.collection('beforeSearch').insert(document, function(err, records) {
					 if(err){ throw err
					 }
			 });
}
app.post('/imageScraper',function(req,res){
	 console.log(req.body.gShrch);
	 var imgurls = [];
		google.list({
			keyword: req.body.gShrch,
			num: 15,
			detail: true,
			nightmare: {
				show: false
			}
		})
		.then(function (item){	 
			for(var i=0;i<item.length;i++){ 
				var fNm = '/img/photo'+new Date().getTime()+''+i+'.jpg';
			const options = {
				  url: item[i].url,
				  dest: __dirname +'/public'+fNm   
				}
				imgurls.push(fNm);
			download.image(options)
			  .then(({ filename, image }) => {
				console.log('File saved to', filename)
			  }).catch((err) => {
				throw err
			  }) 
			} 
			saveRcnSrch(req.body.gShrch,imgurls);
			res.send(item); 
		}).catch(function(err) {
			console.log('err', err);
		});
             
});
app.get('/*', function(req, res, next) { 
    res.sendFile('index.html', { root: __dirname + '/public'});
});