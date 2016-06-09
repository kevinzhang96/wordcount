var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');
var nodemailer = require("nodemailer");
var csv_string = require("csv-string");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "Gmail",
   auth: {
	   user: "garagewordcount@gmail.com",
	   pass: "garagewordcount135"
   }
});

/* GET home page. */
router.get('/', function(req, res, next) {
	for (var i = 0; i < 0; i++) {
		smtpTransport.sendMail({
		from: "Garage Wordcount <garagewordcount@gmail.com>", // sender address
		to: "Patrick Pan <patrick.pan@patrickpan.com>", // comma separated list of receivers
		subject: "Hello ✔" + randomstring.generate(), // Subject line
		text: "Hello world ✔" + randomstring.generate(2000) // plaintext body
		}, function(error, response){
			if(error) {
				console.log(error);
			} else {
				console.log("Message sent: " + response.message);   
			}
		});
	}
	res.render('index', { title: 'Express' });
});

router.post('/send', function(req, res) {
	var user = request.body.user;
	var data = request.body.data;
	smtpTransport.sendMail({
		from: "Garage Wordcount <garagewordcount@gmail.com>",
		to: "Patrick Pan <patrick.pan@patrickpan.com>",
		subject: "Today's Statistics",
		text: htmlTemplate(user, data)
	}, function(error, response){
		if(error) {
			console.log(error);
			res.render('email_failure', { title: 'Failure' });
		} else {
			console.log("Message sent: " + response.message);
			res.render('email_success', { title: 'Sent!' });   
		}
	});
});

router.get('/send', function(req, res) {
	res.render('post_req', { title: 'Error' });
});

module.exports = router;

var htmlTemplate = function(user, data) {
	var generateRow = function(key, value) {
		return "<tr><th class='tg-yw4l'>" + key + "</th><th class='tg-yw4l'>" + value + "</th></tr>\n";
	}
	data = data.split("\n")[1].split(',');
	return '<style type="text/css">\n' + 
	'.tg  {border-collapse:collapse;border-spacing:0;}\n' + 
	'.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}\n' + 
	'.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}\n' + 
	'.tg .tg-yw4l{vertical-align:top}\n' + 
	'</style>\n' + 
	'<table class="tg">\n' +
  	generateRow("start", data[0]) + 
	generateRow("filename", data[1]) +
	generateRow("keystrokes", data[2]) + 
	generateRow("length", data[3]) + 
	'</table>\n';
}