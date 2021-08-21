const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');

const { User } = require('../../models/user');
const { Goal } = require('../../models/goal');
const Constants = require('../../models/constants');

const SALT_VALUE = 10;

const schema = Joi.object({
    name: Joi.string().min(Constants.NAME_MIN_LENGTH).max(Constants.NAME_MAX_LENGTH).required(),
    email: Joi.string().min(Constants.EMAIL_MIN_LENGTH).max(Constants.EMAIL_MAX_LENGTH).email().required(),
    username: Joi.string().min(Constants.USERNAME_MIN_LENGTH).max(Constants.USERNAME_MAX_LENGTH).required(),
    password: Joi.string().min(Constants.PASSWORD_MIN_LENGTH).max(Constants.PASSWORD_MAX_LENGTH).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    age: Joi.number().integer().min(Constants.AGE_MIN_VALUE).max(Constants.AGE_MAX_VALUE).required(),
    height: Joi.number().integer().min(Constants.HEIGHT_MIN_VALUE).max(Constants.HEIGHT_MAX_VALUE).required(),
    weight: Joi.number().integer().min(Constants.WEIGHT_MIN_VALUE).max(Constants.WEIGHT_MAX_VALUE).required(),
    gender: Joi.number().integer().valid(0,1,2).required(),
    goal: Joi.string().min(Constants.GOAL_MIN_LENGTH).max(Constants.GOAL_MAX_LENGTH).required(),
});

validateRegisterInput = (registerData) => schema.validate(registerData);

router.post('/', async(req, res) => {
    const { error } = validateRegisterInput(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({email: req.body.email});
        if(user) return res.status(400).send('Email already exists');

        user = await User.findOne({username: req.body.username});
        if(user) return res.status(400).send('Username already exists');

        user = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            age: req.body.age,
            height: req.body.height,
            weight: req.body.weight,
            gender: req.body.gender,
            goal: new Goal({title: req.body.goal}),
        });

        const salt = await bcrypt.genSalt(SALT_VALUE);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        res.send({name: user.name, email:user.email});
    }
    catch(ex) {
        res.send(ex);
    }
});

module.exports = router;