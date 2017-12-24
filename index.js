var express = require('express');
var app = express();


var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });

var AWS = require('aws-sdk');
AWS.config.region = "us-east-1";

AWS.config.loadFromPath('./config.json');
var fs = require('fs-extra');
var path = require('path');
const fetch = require('fetch-base64');


app.use(express.static('public'));

var rekognition = new AWS.Rekognition({region: "us-east-1"});

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

app.post('/api/detecttext', upload.single("image"), function (req, res, next) {
	var bitmap = fs.readFileSync(req.file.path);

	rekognition.detectText({
	 	"Image": { 
	 		"Bytes": bitmap,
	 	},
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

app.post('/api/detectceleb', upload.single("image"), function (req, res, next) {
	var bitmap = fs.readFileSync(req.file.path);

	rekognition.recognizeCelebrities({
	 	"Image": { 
	 		"Bytes": bitmap,
	 	},
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

app.post('/api/comparefaces', upload.array('image', 2), function (req, res, next) {
	
	var bitmap = [];
	var files = req.files;
	console.log(files);
	for(var i = 0;i < files.length; i++){
		bitmap[i] = fs.readFileSync(files[i].path);
	}	
	var params = {
					  SourceImage: { 
						Bytes: bitmap[0]
					  },
					  TargetImage: { 
						Bytes: bitmap[1]
					  },
					  SimilarityThreshold: 0.0
				};

	rekognition.compareFaces(params, function(err, data) {
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