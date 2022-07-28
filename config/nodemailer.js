const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { relative } = require('path');
const env = require('./environment');
smtp = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'amitmandawaria99@gmail.com',
    pass: 'vvgxuvvyjewtcbpk'
  }
};
let transporter = nodemailer.createTransport(smtp);

let renderTemplate = (data, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, '../views/mailers', relativePath),
    data,
    function (err, template) {
      if (err) { console.log('error in rendering template'); return; }

      mailHTML = template;
    }
  )
  return mailHTML;
}

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate
}