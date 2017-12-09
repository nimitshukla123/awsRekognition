var express = require('express');
var app = express();

var config = require('./config.js')

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });

var AWS = require('aws-sdk');
AWS.config.region = config.region;

AWS.config.loadFromPath('./config.json');
var fs = require('fs-extra');
var path = require('path');


app.use(express.static('public'));

var rekognition = new AWS.Rekognition({region: config.region});

app.post('/api/recognize', upload.single("image"), function (req, res, next) {
	var bitmap = fs.readFileSync(req.file.path);

	rekognition.detectFaces({
	 	"Image": { 
	 		"Bytes": bitmap,
	 	},
	 	"Attributes" : ["ALL"],
	}, function(err, data) {
	 	if (err) {
	 		res.send(err);
	 	} else {
			if(data && data.FaceDetails.length > 0 )
			{
				res.send(data);	
			} else {
				res.send("Not recognized");
			}
		}
	});
});

app.post('/api/detectlables', upload.single("image"), function (req, res, next) {
	var bitmap = fs.readFileSync(req.file.path);

	rekognition.detectLabels({
	 	"Image": { 
	 		"Bytes": bitmap,
	 	},
	 	MaxLabels: 10,
        MinConfidence: 0.0
	}, function(err, data) {
	 	if (err) {
	 		res.send(err);
	 	} else {
			if(data)
			{
				res.send(data);	
			} else {
				res.send("Not recognized");
			}
		}
	});
});

app.listen(5555, function () {
	console.log('Listening on port 5555!');
})