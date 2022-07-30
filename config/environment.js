const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory
});
const development = {
  name: 'development',
  asset_path: './assets',
  session_cookie_key: 'blahsomething',
  db: 'mongodb+srv://amitmandawaria999:9649796384@cluster0.jpujq5o.mongodb.net/codeial?retryWrites=true&w=majority',
  google_client_id: "322137722164-f1ajsl7gk3cstv6omtiu582da8c0khaj.apps.googleusercontent.com",
  google_client_secret: "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",
  google_call_back_url: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: 'codeial',
  morgan: {
    mode: 'dev',
    options: { stream: accessLogStream }
  },
  CLOUDINARY_NAME: 'dpwvsubmm',
  CLOUDINARY_API_KEY:'472134579935991',
  CLOUDINARY_API_SECRET:'V0tliwFAi-LTbmxdantB57fC_zc'
}


const production = {
  name: 'production',
  asset_path: process.env.CODEIAL_ASSET_PATH,
  session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
  db: process.env.CODEIAL_DB,
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PASSWORD
    }
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  morgan: {
    mode: 'combined',
    options: { stream: accessLogStream }
  }
}


module.exports = development; 

// module.exports = eval(process.env.CODEIAL_ENVIRONMENT == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT));