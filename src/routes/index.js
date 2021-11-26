/*****************PARTE DE ROLY********************/
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const token = require("../config/token.config");
const validator = require("validator");
require("dotenv").config();

/* IMPORTAR CONTROLADORES */
const UserController = require("../controller/UserController");
const UnitController = require("../controller/UnitController");
const TaskController = require("../controller/TaskController");
const QuestionController = require("../controller/QuestionController");
const ProgressController = require("../controller/ProgressController");

/* INSTANCIAR CLASES DE CONTROLLADORES */
const user = new UserController();
const unit = new UnitController();
const progress = new ProgressController();
const task = new TaskController();
const question = new QuestionController();


router.get("/", async (req, res) => {
  res.json({ res: process.env.USER_MAIL });
});

router.get("/auth/confirm/:confirmationCode", async (req, res, next) => {

  var user_token = await user.findUser(null, null, req.params.confirmationCode);
  if (!user_token) {
    res.json({ res: "USER NOT EXIST" });
  } else {
    var respuesta = await user.changeUser(user_token._id, { status: "Active" });
    if (respuesta !== "OK") {
      res.json({ res: respuesta });
    } else {
      res.redirect(process.env.APP_URL);
    }
  }
});

router.get("/restartPassword/:mail", (req, res, next) => {
  var user_find = user.findUser(null, req.params.mail);
  if (!user_find) {
    res.json({ res: "USER NOT EXIST" });
  } else {
  }
});

/******************************** USUARIO *************************************************/
router.post("/signup", token.confirmToken_user, async (req, res) => {
  var datos_user = req.body;
  try {
    
    var usuario_existe = await user.findUser(null, req.body.mail);
    if (!usuario_existe) {
      if (req.body.password) {
        datos_user.password = await bcrypt.hash(
          req.body.password,
          parseInt(process.env.BCRYPT_SALT_ROUNDS)
        );
      }
      
      var respuesta = await user.saveUser(datos_user);
      /* El usuario de guardó */
      var resp = await progress.saveProgress({
        user_id: respuesta._id,
      });
      res.json({ res: respuesta });
    } else {
      res.json({ res: "USER EXITS", user: usuario_existe });
    }
  } catch (error) {
    res.json({ res: "ERROR", err: error });
  }
});

router.post("/signin", token.confirmToken_user, async (req, res) => {
  const userBody = req.body;
  if (validator.contains(userBody.mail, "utm.edu.ec")) {
    let body = {
      usuario: userBody.mail,
      clave: userBody.password,
    };
    try {
      let response = await user.UserUTM(body);
      if (response.state === "success") {
        let user_utm = response.value;
        const user_find = await user.findUser(null, userBody.mail);
        if (user_find) {
          //existe el usuario 
          res.json({ res: user_find });
        } else {
          let usuario_save = {
            name: user_utm.nombres,
            mail: body.usuario,
          };
          const user_save = await user.saveUser(usuario_save)
          if (user_save){
            var resp = await progress.saveProgress({
              user_id: user_save._id,
            });
            res.json({res: user_save})
          }
        }
      }else if(response === 'incorrecta'){
        res.json({res: 'incorrecta', error: new Error('Usuario o contraseña incorrectos')});
      }
      
      // else if (response.state === "error"){
      //   if(response.state_info === "no"){
      //     res.json({res: "INCORRECT_PASSWORD_UTM", error: response.error})
      //   }else if(response.state_info === "mensaje"){
      //     res.json({res: "USER_NOT_EXIST_UTM", error: response.error})
      //   }
      // }
    } catch (error) {
      console.log("entra aca");
      res.json(error);
    }
  } else {
    try {
      const user_res = await user.findUser(null, userBody.mail);
      if (user_res) {
        /* si existe */
        const result = await bcrypt.compare(userBody.password, user_res.password);
        if (result) {
          /* contraseñas iguales */
          res.json({ res: user_res });
        } else {
          /* Credenciales incorrectas */
          res.json({ res: "PASSWORD INCORRECT" });
        }
      } else {
        res.json({ res: "USER NOT EXIST" });
      }
    } catch (error) {
      res.json({ res: "ERROR", err: error });
    }
  }
});

router.get("/user/:id", async (req, res) => {
  const user_find = await user.findUser(req.params.id);
  if (user_find) {
    /* el usuario existe */
    res.json(user_find);
  } else {
    /* Usuario no existe */
    res.json({ res: "User Not Exist" });
  }
});

//ruta para obetener la informacion de todos los modulos mas el progreso del usuario
router.post("/user_progress/:user_id", token.confirmToken, async (req, res) => {

  var array_respuesta = [];
  var respuesta = new Object();
  var type_questions = ["writing", "vocabulary", "reading", "grammar"];
  var units = await unit.getUnits();
  var user_id = req.params.user_id;

  var user_exist = await progress.getIdProgress(user_id);
  if (user_exist) {
    for (let i in units) {
      respuesta.book_info = units[i];
      for (let j in type_questions) {
        var type_question = type_questions[j];
        var progress_user = await progress.getProgresses_user_filter(
          user_id,
          units[i]._id,
          type_question
        );
        var tasks_specificType = await task.getTasks_specificType(
          units[i]._id,
          type_question
        );

        switch (type_question) {
          case "writing":
            respuesta.writing = await progress.unify_information(
              progress_user,
              tasks_specificType
            );
            break;
          case "vocabulary":
            respuesta.vocabulary = await progress.unify_information(
              progress_user,
              tasks_specificType
            );
            break;
          case "reading":
            respuesta.reading = await progress.unify_information(
              progress_user,
              tasks_specificType
            );
            break;
          case "grammar":
            respuesta.grammar = await progress.unify_information(
              progress_user,
              tasks_specificType
            );
            break;
          default:
            console.log("Eso es todo amigos..");
        }
      }
      array_respuesta.push(respuesta);
      respuesta = {};
    }
    res.json(array_respuesta);
  } else {
    res.json({ error: "user no exist" });
  }
});

//token.confirmToken,
//Ruta para obtener las preguntas de una leccion
router.post("/task/:task_id", token.confirmToken, async (req, res) => {
  
  var questions = await question.getQuestions(req.params.task_id);
  if (questions) {
    if (questions.length != 0) {
      res.json(questions);
      //res.json(questions.length);
    } else {
      res.json({ error: "task empty" });
    }
  } else {
    res.json({ error: "task no exist" });
  }
});

//Ruta para obtener las preguntas de una libro
router.get("/book/:n_book", token.confirmToken, async (req, res) => {
  var units = await unit.getUnits();
  var tasks = await task.getTasks();

  var respuesta = [];

  var units_filter = units.filter(function (obj) {
    if (obj.book == req.params.n_book) {
      return true;
    } else {
      return false;
    }
  });

  var tasks_filter = tasks.filter(function (obj) {
    var bandera = false;
    for (let unit in units_filter) {
      if (
        JSON.stringify(obj.unit_id) === JSON.stringify(units_filter[unit]._id)
      ) {
        bandera = true;
      }
    }
    return bandera;
  });

  for (let i in tasks_filter) {
    var questions = await question.getQuestions(tasks_filter[i]._id);
    respuesta = respuesta.concat(questions);
  }

  res.json(respuesta);
});

//Ruta para obtener las preguntas de todos los libros
router.get("/evaluation", token.confirmToken, async (req, res) => {
  var questions = await question.getAllQuestions();
  res.json(questions);
});

//Ruta para obtener las preguntas de una unidad y type especifico
router.get("/review/:book/:module/:unit/:type", token.confirmToken, async (req, res) => {
  const body = req.params;

  var unit_id = await unit.getIdUnit(body.unit, body.module, body.book);
  var tasks = await task.getTasks_specificType(unit_id, body.type);

  var respuesta = [];
  for (let i in tasks) {
    var questions = await question.getQuestions(tasks[i]._id);
    respuesta = respuesta.concat(questions);
  }

  res.json(respuesta);
});

/******************************** UNIDAD *************************************************/
//crear una unidad
router.post("/unit/create", token.confirmToken_user, async (req, res) => {
  const unit_body = req.body;
  try {
    var respuesta = await unit.saveUnit(unit_body);
    if (respuesta.res == "ok") {
      res.json({ message: "Nueva Unidad agregada" });
    } else {
      if (respuesta.name == "ValidationError") {
        res.json(respuesta.message);
      } else {
        res.json(respuesta);
      }
    }
  } catch (error) {
    res.send(error);
    next();
  }
});

/******************************** LECCION *************************************************/
//crear una leccion
router.post("/task_create", token.confirmToken_user, async (req, res, next) => {
  try {
    var unit_id = await unit.getIdUnit(
      req.body.unit_id.unit,
      req.body.unit_id.module,
      req.body.unit_id.book
    );
    if (unit_id) {
      req.body.unit_id = unit_id;
      const task_body = req.body;
      var respuesta = await task.saveTask(task_body);
      if (respuesta.res === "ok") {
        res.json({ message: "Nueva Leccion agregada" });
      } else {
        if (respuesta.name === "ValidationError") {
          res.json(respuesta.message);
        } else {
          res.json(respuesta);
        }
      }
    } else {
      res.json({ message: "Error unidad no encontrada" });
    }
  } catch (error) {
    res.send(error);
    next();
  }
});

/******************************** PREGUNTA *************************************************/
//crear una pregunta
router.post("/question/create", token.confirmToken_user, async (req, res, next) => {
  try {
    var unit_id = await unit.getIdUnit(
      req.body.task_id.unit,
      req.body.task_id.module,
      req.body.task_id.book
    );
    if (unit_id) {
      var task_id = await task.getIdTask(
        unit_id,
        req.body.task_id.type,
        req.body.task_id.topic
      );
      if (task_id) {
        req.body.task_id = task_id;
        const question_body = req.body;
        //res.json(question_body);
        var respuesta = await question.saveQuestion(question_body);
        if (respuesta.res === "ok") {
          res.json({ message: "Nueva Pregunta agregada" });
        } else {
          if (respuesta.name === "ValidationError") {
            res.json(respuesta.message);
          } else {
            res.json(respuesta);
          }
        }
      } else {
        res.json({ message: "Error leccion no encontrada" });
      }
    } else {
      res.json({ message: "Error unidad no encontrada" });
    }
  } catch (error) {
    res.send(error);
    next();
  }
});

/******************************** PROGRESO *************************************************/
//actualizar el progreso de un usuario
router.post("/progress/update", token.confirmToken, async (req, res, next) => {
  try {
    var user_datos = await user.findUser(req.body.user_id, null, null);
    if (user_datos) {
      var task_datos = await task.findTask(req.body.task_id);
      if (task_datos) {
        var user_progress = await progress.getIdProgress(user_datos._id);
        if (user_progress) {
          //verificar si esa leccion ya existe en el progreso del usuario
          var exist_task_in_progress = await progress.taskExistinProgress(
            user_datos._id,
            task_datos._id
          );
          if (!exist_task_in_progress.tasks_id || !exist_task_in_progress.tasks_id.includes(task_datos._id)) {
            //agrega el id de la leccion a ese usuario
            var update = await progress.updateProgress(
              user_datos._id,
              task_datos._id
            );
            res.json({ res: "Task Registrada" });
          } else {
            res.json({ res: "Task ya ha sido registrado en ese usuario" });
          }
        } else {
          res.json({ res: "User no tiene Progreso" });
        }
      } else {
        res.json({ res: "Task Not Exist" });
      }
    } else {
      res.json({ res: "User Not Exist" });
    }
  } catch (error) {
    res.send(error);
    next();
  }
});

module.exports = router;
