const mongo = require('./mongo');

module.exports.registerUser = (user) => {
  console.log(user);
};

module.exports.saveUser = (user) => {
  return mongo.User.findOne({"id": user.id}).exec().then((answer) => {
    // console.log(answer);
    if (answer === null) {
      console.log('registering new user');
      user.token = Math.random().toString(36).slice(2);
      const userModel = new mongo.User(user);
      userModel.save();
      return {success: true, token: user.token};
    }
    else {
      console.log('already exists');
      return {success: false, message: "already exists"};
    }
  });
};

module.exports.getUsersByPubkeys = (pubkeys) => {
    return mongo.User.find({pubkey: {$in: pubkeys}}).exec();
};


module.exports.getUserByToken = (token) => {
  return mongo.User.findOne({"token": token}).exec();
};

module.exports.getUserById = (userId) => {
  return mongo.User.findOne({"id": userId}).exec();
};

module.exports.login = (userId, password) => {
  return mongo.User.findOne({"id": userId, "password": password}).exec().then((answer) => {
    if(answer === null) {
      console.log("User not found");
      return {success: false, message: 'Wrong username/password'};
    }
    else {
      console.log('Found user');
      return {success: true, token: answer.token}
    }
  });
};


