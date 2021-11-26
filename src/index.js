/*****************PARTE DE ROLY********************/
const express = require("express");
const morgan = require("morgan");
const mongoose = require("./database/index.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const routers = require("./routes");
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* NO BORRAR ES NECESARIO USAR ESTOS CORS PARA USAR EN API */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(cors());
app.use(morgan());



app.use(routers);
app.use(express.static("src/uploads"));

app.listen(process.env.PORT || 5000, function () {
  console.log("Servidor corriendo BELLEZA");
});
