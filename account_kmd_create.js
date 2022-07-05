require('dotenv').config()
const algosdk = require('algosdk')



const KmdClient = new algosdk.Kmd(process.env.KMD_TOKEN,
    process.env.KMD_SERVER,
    process.env.KMD_PORT);

const createWallet = async (walletName, walletPass) => {

    console.log("############### creating wallet")
    const walletId = (await KmdClient.createWallet(walletName, walletPass, "", "sqlite")).wallet.id;
    console.log("🚀 ~ file: account_kmd_create.js ~ line 12 ~ createWal ~ walletId", walletId)
    const walletHandle = (await KmdClient.initWalletHandle(walletId, walletPass)).wallet_handle_token;
    console.log("🚀 ~ file: account_kmd_create.js ~ line 15 ~ createWal ~ walletHandle", walletHandle)

    return walletHandle;
}

const getWalletMnemonic = async (walletHandle , walletPass) =>{

    console.log("######### exporting account mnemonic ")

    masterDerivationKey = (await KmdClient.exportMasterDerivationKey(walletHandle, walletPassword)).master_derivation_key;

}

const generateKey = ascync (walletHandle) =>{
    console.log("############### creating account")

    const account = (await KmdClient.generateKey(walletHandle).address)
    console.log("🚀 ~ file: account_kmd_create.js ~ line 25 ~ generateKey ~ account", account)
    return account ;
}

(async () => {

    const handleWallet = await createWallet(process.env.KMD_WALLET_NAME, process.env.KMD_WALLET_PASS)
    console.log("🚀 ~ file: account_kmd_create.js ~ line 23 ~ handleWallet", handleWallet)

    console.log("############### wallet created ")
    const listWallets = await KmdClient.listWallets();
    console.log("🚀  listWallets", listWallets)


})().catch(console.error)

