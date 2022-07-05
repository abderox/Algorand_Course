require('dotenv').config()
const algosdk = require('algosdk')



const KmdClient = new algosdk.Kmd(process.env.KMD_TOKEN,
    process.env.KMD_SERVER,
    process.env.KMD_PORT);

const createWallet = async (walllrtName, walletPass) => {
    console.log("############### creating wallet")
    const walletId = await KmdClient.createWallet(walllrtName, walletPass, "", "sqlite");
    console.log("🚀 ~ file: account_kmd_create.js ~ line 12 ~ createWal ~ walletId", walletId)
     
}

(async()=> {
    await createWallet(process.env.KMD_WALLET_NAME,process.env.KMD_WALLET_PASS)
    console.log("############### wallet created ")

})().catch(console.error)

