const sha256 = require("js-sha256");

function prepareParameters(deployer){
    const acc1 = deployer.accountsByName.get("acc1");
    const acc2 = deployer.accountsByName.get("acc2");

    // converts the secret to sha256 hash and encodes it to base64 format
    const secret = "secret random set of words here";
    const secretHash = Buffer.from(sha256.digest(secret)).toString("base64");

    // smart contract template params
    const scTemplateParams = {
        acc1: acc1.addr,
        acc2: acc2.addr,
        hash: secretHash,
        timeout: 3001 //placeholder value
    };

    return { acc1, acc2, secret, scTemplateParams, secretHash };
}

module.exports = { prepareParameters }
