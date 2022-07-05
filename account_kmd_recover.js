require('dotenv').config()
const algosdk = require('algosdk')



const KmdClient = new algosdk.Kmd(process.env.KMD_TOKEN,
    process.env.KMD_SERVER,
    process.env.KMD_PORT);

const recoverAccount = async (wallet_mnemonic, new_wallet_name, new_wallet_pass) => {
    console.log("########## Recovering account from wallet mnemonic ");

    const masterDerivationKey = algosdk.mnemonicToMasterDerivationKey(wallet_mnemonic);
    console.log("🚀 ~ file: account_kmd_recover.js ~ line 14 ~ recoverAccount ~ masterDerivationKey", masterDerivationKey)
    const walletId = (await KmdClient.createWallet(new_wallet_name, new_wallet_pass, masterDerivationKey)).wallet.id;
    console.log("🚀 ~ file: account_kmd_recover.js ~ line 16 ~ recoverAccount ~ walletId", walletId)
    const walletHandle = (await KmdClient.initWalletHandle(walletId, new_wallet_pass)).wallet_handle_token;
    console.log("🚀 ~ file: account_kmd_recover.js ~ line 18 ~ recoverAccount ~ walletHandle", walletHandle)
    const account = (await KmdClient.generateKey(walletHandle)).address;
    console.log("🚀 ~ file: account_kmd_recover.js ~ line 20 ~ recoverAccount ~ account", account)

    console.log("########## Recovered ! ");
    return account;
}

(async () => {
    console.log(recoverAccount(process.env.KMD_MNEMONIC_WALLET, process.env.KMD_WALLET_NAME + "somuch", "newpassword"))
    const listWallets = await KmdClient.listWallets();
    console.log("🚀  listWallets", listWallets)
})().catch(console.error)