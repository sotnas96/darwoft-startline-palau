const {validationResult} = require('express-validator');
const userController = {
    list: (req,res) => {
        res.send("this are all the users")
    },
    userDetail: (req,res) => {
        res.send(`this is user id: ${req.params.id}`)
    },
    signUp:(req,res) => {
        //extraer info del body
        // const {name, lastName, email, password} = req.body;
        //validar 
        let errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()}); 
        }
        res.status(200).json({message: "user registered successfully"})
        //if ok, guardo en db else error msg
        //devuevo mensaje de exito
    }
};
module.exports = userController;