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

const getWalletMnemonic = async (walletHandle, walletPass) => {

    console.log("######### exporting account mnemonic ")

    const masterDerivationKey = (await KmdClient.exportMasterDerivationKey(walletHandle, walletPass)).master_derivation_key;
    console.log("🚀 ~ file: account_kmd_create.js ~ line 26 ~ getWalletMnemonic ~ masterDerivationKey", masterDerivationKey)
    walletMnemonic = algosdk.masterDerivationKeyToMnemonic(masterDerivationKey)
    console.log("🚀 ~ file: account_kmd_create.js ~ line 28 ~ getWalletMnemonic ~ walletMnemonic", walletMnemonic)


}

const generateKey = async (walletHandle) => {
    console.log("############### creating account")

    const account = (await KmdClient.generateKey(walletHandle)).address
    console.log("🚀 ~ file: account_kmd_create.js ~ line 25 ~ generateKey ~ account", account)

}

(async () => {

    const walletPass = process.env.KMD_WALLET_PASS;
    const walletName = process.env.KMD_WALLET_NAME;

    const handleWallet = await createWallet(walletName, walletPass)
    await generateKey(handleWallet);
    await getWalletMnemonic(handleWallet, walletPass)

    console.log("############### wallet created ")
    const listWallets = await KmdClient.listWallets();
    console.log("🚀  listWallets", listWallets)


})().catch(console.error)

