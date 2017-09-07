let port = 5005;
let express = require('express');
let app = express();
var http = require('http').Server(app);
let usersStorage = require("./usersStorage");

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('dist'));
// app.use(express.static('static'));

app.use('/test', function root(req, res) {
  res.json({ "success": true });
});

app.use('/auth/register', function root(req, res) {
  console.log("Request for register");
  let user = {
    id: req.body.id,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type,
    pubkey: req.body.pubkey
  };
  usersStorage.saveUser(user).then((result) => {
    res.json(result);
  });
});

app.use('/auth/check', function root(req, res) {
  let token = req.query.token;
  usersStorage.getUserByToken(token).then((answer) => {
    if(answer == null) {
      return res.json({success: false, message: "token is not valid"});
    }
    else {
      answer.password = "---";
      return res.json({success: true, user: answer});
    }
  });
});

app.use('/auth/about', function root(req, res) {
  let id = req.query.id;
  usersStorage.getUserById(id).then((answer) => {
    if(answer == null) {
      return res.json({success: false, message: "not found"});
    }
    else {
      answer.password = "---";
      answer.token = "---";
      return res.json({success: true, user: answer});
    }
  });
});

app.use('/auth/aboutkeys', function root(req, res) {
    let pubkeys = req.body.pubkeys;
    console.log("Request for user by keys");
    usersStorage.getUsersByPubkeys(pubkeys).then((users) => {
        if(users == null) {

            return res.json({success: false, message: "not found anything"});
        }
        else {
            let result = users.map((user) => {
                user.password = "---";
                user.token = "---";
                return user;
            });
            return res.json({success: true, users: result});
        }
    });
});

app.use('/auth/login', function root(req, res) {
  console.log('Login request');
  usersStorage.login(req.body.id, req.body.password).then((result) => {
    res.json(result);
  });
});

http.listen(port, function() {
  console.log('listening on *:' + port);
});
