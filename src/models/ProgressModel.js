/*****************PARTE DE ROLY********************/
import { DataTypes } from "sequelize";
import { sequelize } from '../database/index'


const Progress = sequelize.define('progresses', {
  _id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    //autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull:false,
    //ref: "User"
  },
  tasks_id: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    //ref: "Task"
  }

},
{
    timestamps: false
});

export default Progress;