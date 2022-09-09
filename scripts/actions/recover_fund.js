const { executeTransaction } = require("@algo-builder/algob");
const { types ,BuilderError} = require("@algo-builder/web");
const algob = require("@algo-builder/algob");
const { prepareParameters } = require("./common");

async function run(runtimeEnv, deployer) {
    // get required info
    const { acc1, acc2, scTemplateParams, secret } = prepareParameters(deployer);

    // replace timeout value with the one saved in checkpoint
    scTemplateParams.timeout = deployer.getCheckpointKV("timeout");
    const lsig = await deployer.loadLogic("htlc.py", scTemplateParams)
    if (lsig === undefined) {
        return;
    }

    const txnParams = {
        type: types.TransactionType.TransferAlgo,
        sign: types.SignType.LogicSignature,
        fromAccountAddr: lsig.address(),
        toAccountAddr: acc1.addr,
        amountMicroAlgos: 5e6,
        lsig: lsig,
        args: [algob.convert.stringToBytes("nada")],
        payFlags: { totalFee: 1000 },
    }

    try {
        await executeTransaction(deployer, txnParams);
    } catch (e) {
        if (types.isRequestError(e)) {
            console.error("Transaction Failed", e || e.response || e.response.error);
        }
        if (e instanceof BuilderError) console.error("Transaction Failed", e.message);
        console.error("An unexpected error occurred:", e);
    }

    // write your code here
}

module.exports = { default: run };
