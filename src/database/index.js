
// /*****************PARTE DE ROLY********************/
// const mongoose = require('mongoose');
// require('dotenv').config()
// const BD_URL = process.env.BD_URL;

// mongoose.Promise = global.Promise;
// mongoose.connect(
//     //'mongodb://localhost/LearningEnglish'
//     //coneccion a la base de datos en la nube
//     //'mongodb+srv://root:utm.english.cluster@englishcluster.eayiw.mongodb.net/LearningEnglish?retryWrites=true&w=majority',
//     BD_URL,
//     {
//         useNewUrlParser : true,
//         useUnifiedTopology: true,
//     }
// )
// .then(db => console.log("db Connected"))
// .catch(error => console.log(error));

// mongoose.set('useCreateIndex', true)

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    'postgres',
    'postgres',
    'root',
    {
        host: 'localhost',
        dialect: 'postgres',
        omitNull: true,
        pool:{
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        //logging: false
    }
);

sequelize.sync({alter:true}).then(() => "Database created");
