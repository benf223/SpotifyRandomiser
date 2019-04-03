var express = require('express');
var app = express();
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');

const path = require('path');
var environment = require('./environment.json');

app.use(express.static(__dirname + '/dist/spotifyfrontend'))
    .use(cors())
    .use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next();
});

app.get('/login', (req, res) => {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    var scope = 'user-read-private user-read-email user-read-playback-state playlist-read-private playlist-read-collaborative playlist-modify-private';

    res.redirect('https://accounts.spotify.com/authorize?' +
        'response_type=' + encodeURIComponent('code') +
        '&client_id=' + encodeURIComponent(environment.clientId) +
        '&scope=' + encodeURIComponent(scope) +
        '&redirect_uri=' + encodeURIComponent(environment.redirect_uri) +
        '&state=' + encodeURIComponent(state)
    );
});

app.get('/callback', (req, res) => {

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
    } else {
        res.clearCookie(stateKey);

        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: environment.redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(environment.clientId + ':' + environment.clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, (err, response, body) => {
            if (!err && response.statusCode === 200) {
                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                res.redirect('http://localhost:3000/t/?' +
                    querystring.stringify({
                        a: access_token,
                        r: refresh_token
                    })
                );
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    })
                );
            }
        });
    }
});

app.get('/refresh_token', function (req, res) {
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

// Redirects

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/spotifyfrontend/index.html'));
});

app.get('/t', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/spotifyfrontend/index.html'));
});

app.get('/playlists', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/spotifyfrontend/index.html'));
});

app.get('/playlist', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/spotifyfrontend/index.html'));
});

app.listen(process.env.PORT || 3000);

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';