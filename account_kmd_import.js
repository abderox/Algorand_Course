const algosdk = require('algosdk');
require('dotenv').config()

const KmdClient = new algosdk.Kmd(process.env.KMD_TOKEN,
    process.env.KMD_SERVER,
    process.env.KMD_PORT);

const getWallatHandle = async (wallet_name, wallet_pass) => {

    const { wallets } = (await KmdClient.listWallets());
    const wallet = wallets.filter((item) => item.name === wallet_name)
    const walletId = wallet[0].id;
    console.log("🚀 ~ file: account_kmd_export.js ~ line 14 ~ getWallatHandle ~ walletId", walletId)
    const walletHandle = (await KmdClient.initWalletHandle(walletId, wallet_pass)).wallet_handle_token;
    return walletHandle;
}


const importAccount  = async(wallet_mnemonic , wallet_handle) => {
        const key = algosdk.mnemonicToSecretKey(wallet_mnemonic);
        console.log("🚀 ~ file: account_kmd_import.js ~ line 21 ~ importAccount ~ key", )
        let importedAddress = await KmdClient.importKey(wallet_handle,key.sk);
        console.log("🚀 ~ file: account_kmd_import.js ~ line 23 ~ importAccount ~ importedAddress", importedAddress)

        return importedAddress;
}

(async () => {

    // ? I should generate an account for testing 
    let account = algosdk.generateAccount()
    console.log("🚀 ~ file: account_kmd_import.js ~ line 32 ~ account", account)
    let accountMnemonic = algosdk.secretKeyToMnemonic(account.sk);
    console.log("🚀 ~ file: account_kmd_import.js ~ line 33 ~ accountMnemonic", accountMnemonic)
    walletPass = "newpassword";
    walletName = process.env.KMD_WALLET_NAME+"here";
    const walletHandle = await getWallatHandle(walletName, walletPass);
    console.log("🚀 ~ file: account_kmd_import.js ~ line 32 ~ walletHandle", walletHandle)
    const importedAccount = await importAccount(accountMnemonic,walletHandle);
    console.log("🚀 ~ file: account_kmd_import.js ~ line 34 ~ importedAccount", importedAccount)
})();