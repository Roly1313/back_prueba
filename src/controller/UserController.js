//const User = require("../models/UserModel");
import User from '../models/UserModel';
import { QueryTypes } from "sequelize";
import { sequelize } from '../database/index';
const bcrypt = require("bcrypt");
const nodemailer = require("../config/nodemailer.config");
const { isValidObjectId } = require("mongoose");
const { isEmail } = require("validator");
const axios = require("axios");
const https = require("https");
const jwt = require("jsonwebtoken");
const { json } = require("body-parser");


class UserController {
  async saveUser(_user) {
    const token = jwt.sign({ mail: _user.mail }, process.env.SECRET);
    _user.confirmationCode = token;
    try {
      let valor = await sequelize.query("Select _id from users ORDER BY _id DESC LIMIT 1;", { type: QueryTypes.SELECT });
      if(!valor[0]){
        _user._id = 1;
      }else{
        _user._id = valor[0]._id + 1
      }
      var user = new User(_user);
      const user_save = await user.save();
      nodemailer.sendConfirmationEmail(
        _user.name,
        _user.lastname,
        _user.mail,
        _user.confirmationCode
      );
      return user_save;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async UserUTM(params) {
    let body = params;
    const Agent = new https.Agent({ rejectUnauthorized: false });
    let data = null;
    await axios
      .post("https://app.utm.edu.ec/becas/api/publico/IniciaSesion", body, {
        headers: {
          "X-API-KEY": "3ecbcb4e62a00d2bc58080218a4376f24a8079e1",
        },
        httpsAgent: Agent,
      })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        data = 'incorrecta';
      });

      return data
  }

  // async findUser(params) {
  //   var user = null;
  //   try {
  //     if (isValidObjectId(params)) {
  //       user = await User.findById(params);
  //     } else if (isEmail(params)) {
  //       user = await User.findOne({ mail: params });
  //     } else {
  //       user = await User.findOne({ confirmationCode: params });
  //     }
  //     return user;
  //   } catch (error) {
  //     //return 0
  //     console.log(error)
  //     return { error: error };
  //   }
  // }

  async findUser(_id, mail, token) {
    var user = null;
    try {
      if (_id != null) {
        user = await User.findOne({ where:{_id: _id}});
      } else if (mail != null) {
        user = await User.findOne({ where:{ mail: mail }});
      } else {
        user = await User.findOne({ where:{ confirmationCode: token }});
      }
      return user;
    } catch (error) {
      return 0;
      return { error: error };
    }
  }

  async deleteUser(_id) {
    try {
      await User.destroy({ where:{ _id: _id }});
      return { res: "ok" };
    } catch (error) {
      return { error: error };
    }
  }

  async changeUser(_id, _update) {
    try {
      await User.update(_update, { where:{ _id }});
      return "OK";
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}

module.exports = UserController;
