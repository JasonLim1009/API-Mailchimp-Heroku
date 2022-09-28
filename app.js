const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res){
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = 'https://us11.api.mailchimp.com/3.0/lists/b612a93a75';
    const options = {
        method: 'post',
        auth: 'aida:07be831930bd0056425688e31ea95477-us11'
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html');
        } else {
            res.sendFile(__dirname + '/failure.html');
        }

        response.on('data', function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post('/failure', function(req, res){
    res.redirect('/');
});

app.listen(process.env.POST || 3000, function(){
    console.log('server is running on port 3000');
});


// API Key
// 07be831930bd0056425688e31ea95477-us11

// List ID
// b612a93a75
