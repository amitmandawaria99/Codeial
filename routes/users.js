const express = require('express');
const router = express.Router();
const userController = require('../controllers/users_contoller');
const passport = require('passport');

router.get('/profile', passport.checkAuthentication, userController.profile);
router.post('/update/:id', passport.checkAuthentication, userController.update);

router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);

router.post('/create', userController.create);

router.post('/create-session', passport.authenticate(
  'local',
  { failureRedirect: '/users/sign-in' },
), userController.createSession);
router.get('/sign-out', userController.destroySession);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
//receive the data 
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/sign-in' }), userController.createSession);
module.exports = router;