const algosdk = require('algosdk');
const dotenv = require('dotenv');
dotenv.config()
const genStAcc = require('./account_standalone');


(async () => {

    let acc_1 =await genStAcc.generateStandaloneAccount()
    let acc_2 =await genStAcc.generateStandaloneAccount()
    let acc_3 =await genStAcc.generateStandaloneAccount()

    const params = {
        version: 1,
        threshold: 2,
        addrs: [
            acc_1.addr,
            acc_2.addr,
            acc_3.addr,
        ],
    };

    return params;
})().then((params) => {
    console.log("SMOKE SHIT");
    let multisigAddr = algosdk.multisigAddress(params);
    console.log("🚀 ~ file: account_multisig.js ~ line 23 ~ multisigAddr", multisigAddr);
}).catch(console.error)
