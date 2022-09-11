const { executeTransaction, convert, readAppGlobalState } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");
const algosdk = require("algosdk");

async function run(runtimeEnv, deployer) {
    const master = deployer.accountsByName.get("master");
    const approvalFile = "game_approval.py";
    const clearStateFile = "game_clearstate.py";

    // get app info
    let gameApp = deployer.getApp(approvalFile, clearStateFile);
    const appID = gameApp.appID;
    const gameAppAddress = gameApp.applicationAccount;
    let globalState = await readAppGlobalState(deployer, master.addr, appID);
    console.log(globalState);

    // get mvp address
    const mvp = algosdk.encodeAddress(Buffer.from(globalState.get("Mvp"), 'base64'));

    // reward
    const rewardAppArgs = ["Reward"].map(convert.stringToBytes);
    await executeTransaction(deployer, {
        type: types.TransactionType.CallApp,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        appID: appID,
        payFlags: { totalFee: 1000 },
        appArgs: rewardAppArgs,
        accounts: [mvp]
    });

    // get app account balance
    let appAccount = await deployer.algodClient.accountInformation(gameAppAddress).do();
    console.log(appAccount);
}

module.exports = { default: run };
