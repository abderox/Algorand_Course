const algosdk = require('algosdk');
const dotenv = require('dotenv');
dotenv.config();



(async () => {

    // ? Standalone account
    let account = algosdk.generateAccount()
    console.log("🚀 ~ file: account_kmd_import.js ~ line 32 ~ account", account)
    let accountMnemonic = algosdk.secretKeyToMnemonic(account.sk);
    console.log("🚀 ~ file: account_kmd_import.js ~ line 33 ~ accountMnemonic", accountMnemonic)
   
})();