/*****************PARTE DE ROLY********************/
import { DataTypes  } from "sequelize";
import {sequelize} from '../database/index'

import Task from './TaskModel'

const Unit = sequelize.define('units', {
    _id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        //autoIncrement: true
    },
    unit: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    module: {
        type: DataTypes.INTEGER, 
        allowNull:false
    },
    book: {
        type: DataTypes.INTEGER,
        allowNull:false      
    }
},
{
    timestamps: false
});

Unit.hasMany(Task, { foreignKey: 'unit_id', sourceKey: '_id'});
Task.belongsTo(Unit, { foreignKey: 'unit_id', sourceKey: '_id'});


export default Unit;

