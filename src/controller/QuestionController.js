//const Question = require("../models/QuestionModel");
import Question from '../models/QuestionModel';
import { QueryTypes } from "sequelize";
import { sequelize } from '../database/index';

class QuestionController {

  async saveQuestion(_question) {
    try {
      let valor = await sequelize.query("Select _id from questions ORDER BY _id DESC LIMIT 1;", { type: QueryTypes.SELECT });
      if(!valor[0]){
        _question._id = 1;
      }else{
        _question._id = valor[0]._id + 1
      }
      var question = new Question(_question);
      await question.save();
      return { res: "ok" }
    } catch (error) {
      return error
    }
  }

  //devuelve todas las preguntas de una leccion.
  async getQuestions(task_id) {
    try {
      var question_result = await Question.findAll({ where:{ "task_id": task_id}});
      return question_result;
    } catch (error) {
      return 0
    }
  }

  //devuelve todas las preguntas registradas en la base de datos
  async getAllQuestions() {
    try {
      var question_result = await Question.findAll();
      return question_result;
    } catch (error) {
      return 0
    }
  }
}



module.exports = QuestionController;
