const { prepareParameters } = require("./actions/common");

async function run(runtimeEnv, deployer) {
    // get required info
    const { acc1, scTemplateParams } = prepareParameters(deployer);
    const algodClient = deployer.algodClient;
    const checkStatus = await algodClient.status().do();
    const timeBlockCount = checkStatus['last-round'] + 200;
    scTemplateParams.timeout = timeBlockCount;

    await deployer.fundLsig(
        "htlc.py",
        { funder: acc1, fundingMicroAlgo: 1e7 },
        {fee : 1000},
        scTemplateParams
    );

    deployer.addCheckpointKV("User ckp", "Fund contract account");
    deployer.addCheckpointKV("timeout", timeBlockCount);

    // write your code here 
}

module.exports = { default: run };
