const { executeTransaction, convert, readAppGlobalState } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");
const algosdk = require("algosdk");

async function run(runtimeEnv, deployer) {

    const master = deployer.accountsByName.get("master");


    const approvalFile = "game_approval.py";
    const clearStateFile = "game_clearstate.py";


    const gameApp = deployer.getApp(approvalFile, clearStateFile);
    const appID = gameApp.appID;
    const gameAppAddress = gameApp.applicationAccount;
    let globalState = await readAppGlobalState(deployer, master.addr, appID);
    console.log("🚀 ~ file: reward.js ~ line 17 ~ run ~ globalState", globalState)

    let appAccount = await deployer.algodClient.accountInformation(gameAppAddress).do();
    const amountBefore = appAccount["amount"];
    console.log("🚀 ~ file: reward.js ~ line 22 ~ run ~ amountBefore", amountBefore)
    
    const creator = algosdk.encodeAddress(Buffer.from(globalState.get("Creator"), 'base64'));
    console.log("🚀 ~ file: reward.js ~ line 25 ~ run ~ creator", creator)


    const mvp = algosdk.encodeAddress(Buffer.from(globalState.get("Mvp"), 'base64'));
    console.log("🚀 ~ file: reward.js ~ line 25 ~ run ~ mvp", mvp)
    

    const attackAppArgs = ["Reward"].map(convert.stringToBytes);

    await executeTransaction(deployer, {
        type: types.TransactionType.CallApp,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        appID: appID,
        payFlags: { totalFee: 1000 },
        appArgs: attackAppArgs,
        accounts: [mvp]
    });

  

    appAccount = await deployer.algodClient.accountInformation(gameAppAddress).do();
    console.log("contract amount before: ", amountBefore);
    console.log("contract amount after: ", appAccount["amount"]);


   

}

module.exports = { default: run };
