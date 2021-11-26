/*****************PARTE DE ROLY********************/
//const Task = require("../models/TaskModel");
import Task from '../models/TaskModel';
import { QueryTypes } from "sequelize";
import { sequelize } from '../database/index';

class TaskController {

  async saveTask(_task) {
    try {
      let valor = await sequelize.query("Select _id from tasks ORDER BY _id DESC LIMIT 1;", { type: QueryTypes.SELECT });
      if(!valor[0]){
        _task._id = 1;
      }else{
        _task._id = valor[0]._id + 1
      }
      var task = new Task(_task);
      await task.save();
      return { res: "ok" }
    } catch (error) {
      return error
    }
  }
  async getIdTask(unit_id, type, topic) {
    try {
      var task_result = await Task.findOne({ where: { "unit_id": unit_id, "type": type, "topic.top": topic }});
      return task_result._id;
    } catch (error) {
      return 0
    }

  }

  async findTask(_id) {
    try {
      var task = await Task.findOne({where:{ "_id": _id}});
      return task;
    } catch (error) {
      return 0
    }
  }

  //devuelve todas las lecciones de una unidad y de un tipo en especifico
  async getTasks_specificType(unit_id, type) {
    try {
      var task_result = await Task.findAll({where:{ "unit_id": unit_id, "type": type}});
      return task_result;
    } catch (error) {
      return 0
    }
  }

  //devuelve todas las lecciones
  async getTasks() {
    try {
      var task_result = await Task.findAll();
      return task_result;
    } catch (error) {
      return 0
    }
  }
}

module.exports = TaskController;
