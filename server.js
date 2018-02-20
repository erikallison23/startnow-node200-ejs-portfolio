const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 8080;


const app = express();

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'))

//Here we're setting the views directory to be ./views
//thereby letting the app know where to find the template files
app.set('views', './views');

//Here we're setting the default engine to be ejs
//note we don't need to require it, express will do that for us
app.set('view engine', 'ejs');

//Now instead of using res.send we can use
//res.render to send the output of the template by filename
app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Erik',
            lastName: 'Allison',
        }
    }
    res.render('index', data);
});

// GET method route
app.get('/', function (req, res) {
    res.send('GET request to the homepage')
})

// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage')
})

//contact form
app.get('/contact', (req, res) => {
    res.render('contact');
});

//thanks page
app.post('/thanks', (req, res) => {
    const accountSid = process.env.accountSid;
    const authToken = process.env.authToken;
    const client = require('twilio')(accountSid, authToken);

    var userInfo = {
        Name: req.body.Name,
        Email: req.body.Email,
        Company: req.body.Company,
        Subject: req.body.Subject

    }

    client.messages.create({
        to: '+18584421584',
        from:'+18582424212',
        body:  `${userInfo.Name}, ${userInfo.Email}, ${userInfo.Company}, ${userInfo.Subject}` 
    }, function(err, message){
        console.log(accountSid);

    });

    res.render('thanks', {
        userInfo: userInfo
    })
});


// Catch and handle everything else
app.get('*', function (req, res) {
    res.send('Whoops, page not found 404').status(404);
})

app.listen(8080, () => {
    console.log('listening at http://localhost:8080');
});