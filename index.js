const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');



PORT = process.env.PORT ||  5000;


//static file

app.use('/public', express.static(path.join(__dirname, 'public')));


//view engine

app.engine('handlebars', exphbs({defaultLayout: null}));
app.set('view engine', 'handlebars');


//body parser 

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.render('app');
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'shittutaofeek009@outlook.com',
        pass: 'taofeek123456789'
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Resume App" <shittutaofeek009@outlook.com>', // sender address
      to: 'shittutaofeek009@gmail.com', // list of receivers
      subject: 'Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('app', {msg:'Thanks for reaching out'});
  });
  });












app.listen(PORT, () => console.log('server listening on port ' + PORT))