const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const crypto = require('crypto');
const { access } = require('fs');
const { localsName } = require('ejs');

module.exports.auth = function (req, res) {
  console.log('reached hereeee');
  return res.render('verify_email', {
    title: "Codeial | Verify",
  });
}

module.exports.verifyEmail = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });

  console.log(user, req.body);
  if (user) {
    let token = await crypto.randomBytes(20).toString("hex");
    let accessToken = await AccessToken.create({
      user: user,
      token: token,
      isValid: true
    });

    resetPasswordMailer.resetPassword(accessToken);

    return res.render('account_verified', {
      title: "Codeial | Account Verified",
    });
  } else {
    req.flash("error", "Account does not exist with this email");
    return res.redirect('back');
  }
}

module.exports.resetPassword = async function (req, res) {
  let accessToken = await AccessToken.findOne({ token: req.query.accessToken });
  console.log(accessToken, 'AccessToken');
  if (accessToken) {
    if (accessToken.isValid) {
      return res.render('reset_password', {
        title: "Codeial | Reset Password",
        accessToken: accessToken.token
      })
    }
  }

  req.flash('error', 'Token is Expired ! Pls regenerate it.');
  return res.redirect('/auth');
}

module.exports.reset = async function (request, response) {
  console.log(request.query)
  let accessToken = await AccessToken.findOne({ token: request.query.accessToken });
  console.log(accessToken, 'AccessToken')
  if (accessToken) {
    console.log('AccessToken Present')
    if (accessToken.isValid) {
      console.log('AccessToken is valid')
      accessToken.isValid = false;
      if (request.body.password == request.body.confirm_password) {
        console.log('Password  matchedd')
        let user = await User.findById(accessToken.user);
        if (user) {
          console.log('User found', user)
          user.password = request.body.password;
          user.confirm_password = request.body.confirm_password;
          accessToken.save();
          user.save();
          console.log('Password changed', user)
          request.flash('success', 'Password Changed');
          return response.redirect('/users/sign-in');
        }
      } else {
        request.flash('error', 'Password didnt matched');
        return response.redirect('back');
      }


    }
  }

  request.flash('error', 'Token is Expired ! Pls regenerate it.');
  return response.redirect('/auth');
}