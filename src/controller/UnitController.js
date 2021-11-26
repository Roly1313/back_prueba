/*****************PARTE DE ROLY********************/

//var Unit = require("../models/UnitModel");
import Unit from '../models/UnitModel';
import { QueryTypes } from "sequelize";
import { sequelize } from '../database/index';


class UnitController {

  async saveUnit(_unit) {
    try {
      let valor = await sequelize.query("Select _id from units ORDER BY _id DESC LIMIT 1;", { type: QueryTypes.SELECT });
      if(!valor[0]){
        _unit._id = 1;
      }else{
        _unit._id = valor[0]._id + 1
      }
      var unit = new Unit(_unit);
      await unit.save();
      return { res: "ok" }
    } catch (error) {
      return { res: "mal mal" }
      return error
    }
  }

  async getIdUnit(unit, module, book) {
    try {
      var unit_result = await Unit.findOne({where:{ "unit": unit, "module": module, "book": book }});
      //console.log(unit_result);
      return unit_result._id;
    } catch (error) {
      return 0
    }
  }

  //retorna todas las unidades registradas
  async getUnits() {
    try {
      var unit_result = await Unit.findAll();
      return unit_result;
    } catch (error) {
      return 0
    }
  }

}

module.exports = UnitController;
