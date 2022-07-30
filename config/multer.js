const multer = require('multer');
const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, '');
  },
});
const uploadImage = multer({ storage });
module.exports = uploadImage; 