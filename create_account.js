require('dotenv').config();
const algosdk = require('algosdk');
// const log_kmdclinet_response = require("./node_status");

const KmdClient = new algosdk.Kmd(process.env.KMD_TOKEN,
                                  process.env.KMD_SERVER,
                                  process.env.KMD_PORT);

const algoClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN,
                                       process.env.ALGOD_SERVER,
                                       process.env.ALGOD_PORT);

(async()=>{

    // ? instead of the regular way , just use {wallets} it ll retrieve the array directly
    
    const listWallets = await KmdClient.listWallets();
    console.log("🚀 ~ file: create_account.js ~ line 16 ~ listWallets", listWallets)

    const defaultWwallet = listWallets.wallets[0];
    console.log("🚀 ~ file: create_account.js ~ line 18 ~ defaultWwallet", defaultWwallet)

    const wallethandle = await KmdClient.initWalletHandle(defaultWwallet.id)
    console.log("🚀 ~ file: create_account.js ~ line 20 ~ wallethandle", wallethandle)

    const address = (await KmdClient.generateKey(wallethandle.wallet_handle_token)).address;
    console.log("🚀 ~ file: create_account.js ~ line 22 ~ address", address)

    console.log(await algoClient.accountInformation(address).do())
    
})().catch(console.error)