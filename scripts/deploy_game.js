const { executeTransaction, convert } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run(runtimeEnv, deployer) {

    const masterAccount  = deployer.accountsByName.get("master");
    const approvalFile = ("game_approval.py");
    const cleatState = ("game_clearstate.py");

    const monsterHealth = 5;
    const res = await deployer.deployApp(
		approvalFile,
        cleatState,
		{
            sender : masterAccount,
			localInts: 1,
			localBytes: 0,
			globalInts: 2,
			globalBytes: 2,
			appArgs: [convert.uint64ToBigEndian(monsterHealth)],
		},
		{totalFee : 1000}
	);


    const game = deployer.getApp(approvalFile,cleatState);
    const gameAddress = game.applicationAccount;
    console.log("🚀 ~ file: deploy_game.js ~ line 28 ~ run ~ gameAddress", gameAddress);

    await executeTransaction(deployer, {
        type: types.TransactionType.TransferAlgo,
        sign: types.SignType.SecretKey,
        fromAccount: masterAccount,
        toAccountAddr: gameAddress,
        amountMicroAlgos: 2e7, //20 algos
        payFlags: { totalFee: 1000 },
    });

    let appAccount =await deployer.algodClient.accountInformation(gameAddress).do();
    console.log("🚀 ~ file: deploy_game.js ~ line 42 ~ run ~ appAccount", appAccount)
    


}

module.exports = { default: run };
