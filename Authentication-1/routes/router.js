//Import Router
const router = require('express').Router();

//Import Controller
const {registration} = require('../controllers/registration');
const {logIn} = require('../controllers/logIn');
const {forgetPassword , resetPassword} = require('../controllers/forgetPassword');

//Map Controller with the Router's Path
router.post('/registration',registration);
router.post('/login',logIn);

router.post('/forget-password',forgetPassword);
router.post('/reset-password',resetPassword);

//Exports Router
module.exports = router;