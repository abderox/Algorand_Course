const algosdk = require('algosdk');
const dotenv = require('dotenv');
dotenv.config();



module.exports.generateStandaloneAccount = async () => {

    // ? Standalone account
    let account = algosdk.generateAccount()
    console.log("🚀 ~ file: account_standalone.js ~ line 32 ~ account", account.addr)
    let accountMnemonic = algosdk.secretKeyToMnemonic(account.sk);
    console.log("🚀 ~ file: account_standalone.js ~ line 33 ~ accountMnemonic", accountMnemonic)
    return account;
}

