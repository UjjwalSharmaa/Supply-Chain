const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const UserModel = require("../user/user.model");
const SupplyChainModel = require("../supplychaintracking/supplierchain.model");

router.get("/fetchUser", async (req, res) => {
    try {
        const getUsers = await UserModel.find().select({ password: 0 });

        return res.status(200).send({
            data: getUsers,
            message: "User fetched successfully"
        })
    } catch (error) {
        let errorDoc = errorHandler(error);
        return res.status(errorDoc.status).send(errorDoc);
    }
});

router.get("/verifyBlockChain", async (req, res) => {
    try {
        const fetchBlockchainList = await SupplyChainModel.find();

        let blocksArray = [], modifiedDataArray = [], verified;
        for (let outerIndex = 0; outerIndex < fetchBlockchainList.length; outerIndex++) {

            blocksArray = [], verified = true;
            for (let index = 0; index < fetchBlockchainList[outerIndex].blocks.length; index++) {
                let blockData = {}, modifiedData = {};
                if (fetchBlockchainList[outerIndex].blocks[index + 1]) {

                    const currentBlockHash = fetchBlockchainList[outerIndex].blocks[index].hash;
                    const nextBlockLashHash = fetchBlockchainList[outerIndex].blocks[index + 1].lastHash;

                    if (currentBlockHash === nextBlockLashHash) {
                        blockData = { ...fetchBlockchainList[outerIndex].blocks[index], dataModified: false }
                        blocksArray.push(blockData)
                    } else {
                        blockData = { ...fetchBlockchainList[outerIndex].blocks[index], dataModified: true }
                        verified = false;
                        modifiedData.block_chain_name = fetchBlockchainList[outerIndex].name;
                        modifiedData.supplierId = fetchBlockchainList[outerIndex].supplierId;
                        modifiedData.modified_block = blockData;
                        modifiedDataArray.push(modifiedData);

                        blocksArray.push(blockData)
                    }
                } else {
                    blockData = { ...fetchBlockchainList[outerIndex].blocks[index], dataModified: false }
                    blocksArray.push(blockData)
                }
            }
            await SupplyChainModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(fetchBlockchainList[outerIndex]._id) },
                { $set: { blocks: blocksArray } },
                { new: false });

            await SupplyChainModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(fetchBlockchainList[outerIndex]._id) },
                { $set: { verified: verified } },
                { new: false });
        }

        const blockChainVerifiedList = await SupplyChainModel.find();
        return res.status(200).send({
            data: blockChainVerifiedList,
            message: "Data verification complete"
        })

    }
    catch (error) {
        let errorDoc = errorHandler(error);
        return res.status(errorDoc.status).send(errorDoc);
    }
})

module.exports = router;
