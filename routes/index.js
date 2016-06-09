var express = require('express');
var router = express.Router();
var randomstring = require('randomstring');
var nodemailer = require("nodemailer");

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
	var email = request.body.email;
	var text = request.body.text;
	smtpTransport.sendMail({
		from: "Garage Wordcount <garagewordcount@gmail.com>",
		to: email,
		subject: "Today's Statistics",
		text: text
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
