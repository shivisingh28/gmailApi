const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());

app.get('/',function(req,res){
res.send({
message:'Default route in email project'
})
});

const myOAuth2Client = new OAuth2(
process.env.CLIENT_ID,//client id
process.env.CLIENT_SECRET,//client secret
"https://developers.google.com/oauthplayground"
)

myOAuth2Client.setCredentials({
refresh_token:process.env.REFRESH_TOKEN//the refresh token
});

const myAccessToken =  myOAuth2Client.getAccessToken()

const transport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "webdevcommunity.1228@gmail.com", //your gmail account you used to set the project up in google cloud console"
          clientId: process.env.CLIENT_ID,//client id
          clientSecret: process.env.CLIENT_SECRET,//client secret
          refreshToken: process.env.REFRESH_TOKEN,//the refresh token
          accessToken: myAccessToken //access token variable we defined earlier
     }});


app.post('/',function(req,res){
	const mailOptions = {
from: 'webdevcommunity.1228@gmail.com', // sender
to: 'shivigomsi@gmail.com', // receiver
subject: 'Sending Email throgh Gmail Api', // Subject
html: '<p>Email is received</p>'// html body
}

transport.sendMail(mailOptions,function(err,res){
if(err){
res.send({
message:err
})
}else{
transport.close();
console.log("sent");
res.send({
message:'Email has been sent: check your inbox!'
})
}
})

});





app.listen(PORT, function (req, res) {
console.log(`Listening on port ${PORT}`);
})