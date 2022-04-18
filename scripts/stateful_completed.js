const { executeTransaction, convert, readAppGlobalState } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run(runtimeEnv, deployer) {
    const master = deployer.accountsByName.get("master");
    const approvalFile = "sc_approval.py";
    const clearStateFile = "sc_clearstate.py";

    // Create application
    const res = await deployer.deployApp(
        approvalFile,
        clearStateFile,
        {
            sender: master,
            localInts: 0,
            localBytes: 0,
            globalInts: 1,
            globalBytes: 0,
            appArgs: [],
        },
        { totalFee: 1000 }
    );

    console.log(res);
    const appID = res.appID;

    // Retreive Global State
    console.log("reading global state");
    console.log(await readAppGlobalState(deployer, master.addr, appID));

    // Call app with "Add" function
    console.log("call app function Add");
    const addAppArgs = ["Add"].map(convert.stringToBytes); // convert app args to bytes
    await executeTransaction(deployer, {
        type: types.TransactionType.CallApp,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        appID: appID,
        payFlags: { totalFee: 1000 },
        appArgs: addAppArgs,
    });

    // Retreive Global State
    console.log("reading global state");
    console.log(await readAppGlobalState(deployer, master.addr, appID));

    // Call app with "Deduct" function
    console.log("call app function Deduct");
    const deductAppArgs = ["Deduct"].map(convert.stringToBytes); // convert app args to bytes
    await executeTransaction(deployer, {
        type: types.TransactionType.CallApp,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        appID: appID,
        payFlags: { totalFee: 1000 },
        appArgs: deductAppArgs,
    });

    // Retreive Global State
    console.log("reading global state");
    console.log(await readAppGlobalState(deployer, master.addr, appID));

    // Delete App
    console.log("deleting app");
    await executeTransaction(deployer, {
        type: types.TransactionType.DeleteApp,
        sign: types.SignType.SecretKey,
        fromAccount: master,
        appID: appID,
        payFlags: { totalFee: 1000 },
        appArgs: [],
    });
}

module.exports = { default: run };
