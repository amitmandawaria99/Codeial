const Post = require('../models/post');
const User = require('../models/user');
const { post } = require('../routes');

module.exports.home = async function (req, res) {
  try {
    //CHANGE :: populate the likes of each post and comment
    let posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: 'likes'
        },
      })
      .populate('likes');
    console.log(posts[0].comments);
    let users = await User.find({});

    let user;
    if (req.user) {
      console.log("reachedin inside of if");
      user = await User.findById(req.user._id)
        .populate({
          path: "friends",
          populate: {
            path: "from_user",
          },
        })
        .populate({
          path: "friends",
          populate: {
            path: "to_user",
          },
        });
    }

    return res.render('home', {
      title: 'Codeial | Home',
      posts: posts,
      all_users: users,
      user:user
    });
  } catch (err) {
    console.log('Error', err);
    return;
  }
}


//module.exports.actionName = function(req,res){}

//using then 
// Post.find({}).populate('comments').then(function());

//let posts = Post.find({}.populate('comments').exec());

//posts.then();