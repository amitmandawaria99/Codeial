const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
  //the user who sent this request
  from_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  //the user who accepted this request, the naming is just to understan,otherwise, the users won't see a difference
  to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
}, {
  timestamps: true
});

const Friendships = mongoose.model('Friendships', friendshipSchema);
module.exports = Friendships;