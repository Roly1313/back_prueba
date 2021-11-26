/*****************PARTE DE ROLY********************/
import { DataTypes } from "sequelize";
import { sequelize } from '../database/index'

const Question = sequelize.define('questions', {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    //autoIncrement: true
  },
  task_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //ref: "Task"
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.JSON)
    //exists: true,
  },
  body: {
    type: DataTypes.ARRAY(DataTypes.JSONB)
  }

},
  {
    timestamps: false
  });

export default Question;
