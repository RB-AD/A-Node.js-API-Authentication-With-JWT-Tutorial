(ROADBLOCK 1)
joi.validate doesn't work:

const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password:Joi.string().min(6).required()
});


 const validation=schema.validate(req.body);   
    res.send(validation);