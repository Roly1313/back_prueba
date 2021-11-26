/*****************PARTE DE ROLY********************/
import { DataTypes } from "sequelize";
import { sequelize } from '../database/index'

import Progress from './ProgressModel'

const User = sequelize.define('users', {
    _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        //autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        //allowNull: false
    },
    // img:{
    //     type: String,
    //     trim: true,
    // },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // index: true,
        //isLowercase: true,
    },
    password: {
        type: DataTypes.STRING,
        //allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        //type: DataTypes.ENUM( ['Pending', 'Active']),
        allowNull: false,
        defaultValue: 'Pending'
    },
    confirmationCode: {
        type: DataTypes.STRING,
        unique: true
    }

},
{
    timestamps: false
});

User.hasOne(Progress, { foreignKey: 'user_id', sourceKey: '_id'});
Progress.belongsTo(User, { foreignKey: 'user_id', sourceKey: '_id'});

export default User;

