const User = require('../models/user');
const Friendships = require("../models/friendships");
const fs = require('fs');
const path = require('path');
//let's keep it same as before
module.exports.profile = async function (req, res) {
  try {
    console.log("reached in profile");  
    let user = await User.findOne({ _id: req.query.id });
    console.log("current user",req.user);
    let friendship1,friendship2

    friendship1 = await Friendships.findOne({
      from_user: req.user,
      to_user: req.params.id,
    });

    friendship2 = await Friendships.findOne({
      from_user: req.params.id,
      to_user: req.user,
    });

    console.log("friendship1",friendship1);
    console.log("friendship2",friendship2);
    let populated_user = await User.findById(req.user).populate('friends');
    console.log("populated users",populated_user);
    return res.render("user_profile", {
      title: "Codeial | Profile",
      profile_user: user,
      populated_user
    });
  } catch (error) {
    console.log("Error", error);
    return;
  }
};

module.exports.update = async function (req, res) {
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) { console.log('*******Multer Error:', err); }

        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }
          //this is saving the path of the uploaded file into the avatar field in the user
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  } else {
    req.flash('error', err);
    return res.status(401).send('Unauthorized');
  }
}
//render sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/users/profile');
  }
  res.render('user_sign_up', {
    title: "Codeial | Sign Up"
  })
};
//render sign in page
module.exports.signIn = function (req, res) {
  console.log("reached in signin");
  if (req.isAuthenticated()) {
    console.log("isauthenticated");
    console.log("req",req.user._id);
    return res.redirect('/users/profile/{=req.user._id}');
  }
  res.render('user_sign_in', {
    title: "Codeial | Sign In"
  })
};

//get the sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect('back');
  }

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) { console.log("Error in finding user in signing up"); return; }

    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) { console.log("Error in creating user while signing up"); return; }
        return res.redirect('/users/sign-in');
      })
    } else {
      return res.redirect('back');
    }
  })
}

//sign in and create a session for user
module.exports.createSession = function (req, res) {
  req.flash('success', 'Logged in successfully');
  return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash('success', 'You have logged out!');
  //for passing flash msg from req to res use middleware(can use context but not clean code)
  return res.redirect('/');
}