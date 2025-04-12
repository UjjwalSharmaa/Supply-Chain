const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

const app = express();

//Components
//const supplier = require("./supplychaintracking/supplier/supplier")
const supplychain = require("./supplychaintracking/SupplyChain/supplychain")
const user = require("./user/user");
const admin = require("./admin/admin.controller");

mongoose.connect('mongodb+srv://rosz:1234@cluster0-frru9.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB ...."))
    .catch(err => console.log("Connection Error ==>", err))


// mongoose.connect('mongodb://localhost/SupplyChain', {useNewUrlParser: true})
//     .then(() => console.log("Connected to MongoDB ...."))
//     .catch(err => console.log("Connection Error ==>",err))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

// parse application/json
app.use(bodyParser.json())

app.use("/api/supplychain", supplychain);
app.use("/user", user);
app.use("/admin", admin);


const port = process.env.PORT || 3000;
app.listen(port, () => { console.log("Server Started at port :" + port) });
