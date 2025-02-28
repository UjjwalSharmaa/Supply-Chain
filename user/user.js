const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const errorHandler = require('../common/handler/error.handler');
const UserModel = require('./user.model');

const salt = bcrypt.genSaltSync(10);

router.get("/getuser", async (req, res) => {
    try {
        const decode = jwt.verify(req.headers.auth, 'abcd1234');

        const getUser = await UserModel.findOne({ _id: mongoose.Types.ObjectId(decode.uid) }).select({ name: 1, email: 1, role: 1 });

        if (!getUser) {
            throw {
                status: 400,
                message: "Invalid token"
            }
        }
        return res.status(200).send(getUser)
    }
    catch (error) {
        let errorDoc = errorHandler(error);
        return res.status(errorDoc.status).send(errorDoc);
    }

})

router.post("/login", async (req, res) => {
    try {
        const getUser = await UserModel.findOne({ email: req.body.email });

        if (!getUser) {
            throw {
                status: 406,
                message: "Invalid email or password"
            }
        }

        const hash = getUser.password;
        const decodePass = bcrypt.compareSync(req.body.password, hash);

        if (!decodePass) {
            throw {
                status: 406,
                message: "Invalid email or password"
            }
        }

        const token = jwt.sign({ uid: getUser._id, role: getUser.role }, 'abcd1234');
        if (token) {
            const responseObject = {
                uid: getUser._id,
                name: getUser.name,
                role: getUser.role.toLowerCase(),
                token: token
            }
            return res.status(200).send(responseObject)
        }
        else {
            return res.status(400).send("Failed to generate token..")
        }
    }
    catch (error) {
        let errorDoc = errorHandler(error);
        return res.status(errorDoc.status).send(errorDoc);
    }

})

router.post("/signup", async (req, res) => {
    try {
        const hash = bcrypt.hashSync(req.body.password, salt);
        const reqBody = { ...req.body, password: hash, role: req.body.role.toUpperCase() }

        const emailExist = await UserModel.findOne({ email: req.body.email });

        if (emailExist) {
            throw {
                status: 406,
                message: "Email already exist"
            }
        }

        const register = new UserModel(reqBody);
        const registerUser = await register.save();

        if (!registerUser) {
            throw {
                status: 400,
                message: "User registration failed !"
            }
        }

        const token = jwt.sign({ uid: registerUser._id, role: registerUser.role }, 'abcd1234');
        if (token) {
            const responseObject = {
                uid: registerUser._id,
                name: registerUser.name,
                role: registerUser.role.toLowerCase(),
                token: token
            }
            return res.status(200).send(responseObject)
        }
        else {
            return res.status(400).send("Failed to generate token..")
        }
    }
    catch (error) {
        let errorDoc = errorHandler(error);
        return res.status(errorDoc.status).send(errorDoc);
    }

})

module.exports = router;
