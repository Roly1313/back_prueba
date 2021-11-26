//const User = require("../models/UserModel");
import User from '../models/UserModel'
const jwt = require("jsonwebtoken");

module.exports.confirmToken = async (req, res, next)=>{
    const strToken = req.headers.token;
    if(!strToken){
        return res.json({ msj: "Token no encontrado" });
    }
    try {
        const key = jwt.verify(strToken, process.env.SECRET);
        const user = await User.findOne({ where:{ mail: key.mail }});
        if(!user){
            return res.json({ msj: "User no encontrado" });
        }
    } catch (error) {
        return res.json(error);
    }
    next();
}


module.exports.confirmToken_user = async (req, res, next)=>{
    const strToken = req.headers.token;
    if(!strToken){
        return res.json({ msj: "Token no encontrado" });
    }
    try {
        const key = jwt.verify(strToken, process.env.SECRET);
        const secret_token = jwt.verify(process.env.SECRET_TOKEN, process.env.SECRET);
        if(!(key.mail === secret_token.mail)){
            return res.json({ msj: "Error de token" });
        }
    } catch (error) {
        return res.json(error);
    }
    next();
}