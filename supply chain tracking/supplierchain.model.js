var mongoose = require('mongoose');

const supplyChainSchema = new mongoose.Schema({
    name: { type: String, required: true },
    timestamp: { type: Date, default: new Date() },
    supplierId: { type: mongoose.Schema.Types.ObjectId, required: true},
    blocks: [Object],
    verified: { type: Boolean, default: true }
});

const SupplyChainModel = mongoose.model('SupplyChain',supplyChainSchema);
module.exports = SupplyChainModel;