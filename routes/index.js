var express = require('express');
var router = express.Router();

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
  smtpTransport.sendMail({
   from: "Garage Wordcount <garagewordcount@gmail.com>", // sender address
   to: "Kevin Zhang <kevin.zhang500@gmail.com>", // comma separated list of receivers
   subject: "Hello ✔", // Subject line
   text: "Hello world ✔" // plaintext body
  }, function(error, response){
    if(error) {
        console.log(error);
    } else {
        console.log("Message sent: " + response.message);
    }
  });
  res.render('index', { title: 'Express' });
});

module.exports = router;
