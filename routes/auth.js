const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');




router.post('/register', async (req,res) => {
    //validate the data before we add a user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Check if the email is already in the DB
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt)


    //create a new user
    const user = new User({
         name: req.body.name,
         email: req.body.email,
         password: hashedPassword
    });
    try{
        const saveUser = await user.save();
        res.send({user: user._id});

    }catch(err){
        res.status(400).send(err);
    }

});

router.post('/login', async (req,res) => {
    //validate the data before we add a user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the email is not in the DB
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email not found');

    //Check if the pwd is correct
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid Password');


    //create and assign a token
    const token = jwt.sign({_id:user._id},process.env.TOKEN_SECRET);
    res.header('auth_token',token).send(token);    
    
    

});

module.exports = router;