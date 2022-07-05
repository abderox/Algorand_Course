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

const exportAccount = async (wallet_handle, wallet_pass, wallet_account) => {
    console.log("################# exporting Account from wallet");

    let accountKey = await KmdClient.exportKey(
        wallet_handle,
        wallet_pass,
        wallet_account
    );
    console.log("🚀 ~ file: account_kmd_export.js ~ line 22 ~ exportAccount ~ accountKey", accountKey)
    let mnemonic = algosdk.secretKeyToMnemonic(accountKey.private_key);
    return mnemonic ;
    
}

(async () => {
    walletPass = "newpassword";
    walletName = process.env.KMD_WALLET_NAME+"here";
    walletAccount = "EKMKS3M66JAD23754LIKI2ER7X6PZT33SZFPRA6Y57CUEIKURXIFEUL42I"

    const walletHandle = await getWallatHandle(walletName, walletPass);
    console.log("🚀 ~ file: account_kmd_export.js ~ line 33 ~ walletHandle", walletHandle)
    const mnemonic = await exportAccount(walletHandle,walletPass,walletAccount);
    console.log("🚀 ~ file: account_kmd_export.js ~ line 33 ~ mnemonic", mnemonic)
    
})().catch(console.error)