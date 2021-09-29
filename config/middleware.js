//to take out flash messages from req,put to res use middleware
module.exports.setFlash = function (req, res, next) {
  res.locals.flash = {
    'success': req.flash('success'),
    'error': req.flash('error')
  }
  next();
}