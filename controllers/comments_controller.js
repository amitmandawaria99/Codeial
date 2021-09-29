const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {

  try {
    let post = await Post.findById(req.body.post);
    //Must check(user can change post_id in inspect) 
    if (post) {
      Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id
      }, function (err, comment) {
        if (err) { console.log('error in commenting'); return; }
        //updating in comments array(automatically fetch id and push it)
        post.comments.push(comment);
        //with every update have to save that
        post.save();

        return res.redirect('/');
      })
    }
  } catch (err) {
    console.log('Error', err);
    return;
  }
}


module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();

      let post = Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (err) {
    console.log('Error', err);
    return;
  }
}