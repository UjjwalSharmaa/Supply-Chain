var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: {
                type: String,
                enum: ['SUPPLIER', 'MANUFACTURER', 'TRANSPORTER', 'RETAILER', 'CONSUMER'],
                default: 'SUPPLIER'
        },
        phone: { type: String, required: true },
        blockchains: { type: Array, required: true }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;