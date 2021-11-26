/*****************PARTE DE ROLY********************/
import { DataTypes  } from "sequelize";
import {sequelize} from '../database/index'

import Questions from './QuestionModel'
import Progress from './ProgressModel'

const Task = sequelize.define('tasks', {
    _id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        //autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull:false,
        lowercase: true
    },
    unit_id:{
      type: DataTypes.INTEGER,
      allowNull:false,
      //ref: "Unit"
    },
    topic: {
        type: DataTypes.JSON,
        top: DataTypes.STRING,
        img: DataTypes.STRING,
    },
   
    objetive: {
        type: DataTypes.JSON,
        text: DataTypes.STRING,
        img: DataTypes.STRING
    },
    explanation: {
        type: DataTypes.TEXT
    },
    imgs: DataTypes.ARRAY(DataTypes.STRING)

},
{
    timestamps: false
});

Task.hasMany(Questions, { foreignKey: 'task_id', sourceKey: '_id'});
Questions.belongsTo(Task, { foreignKey: 'task_id', sourceKey: '_id'});

// Task.hasOne(Progress);
// Progress.belongsTo(Task);
//Task.hasOne(Progress, { foreignKey: 'tasks_id', sourceKey: '_id'});
//Progress.belongsToMany(Task, { foreignKey: 'tasks_id', sourceKey: '_id'});


export default Task;

