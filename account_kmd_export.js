const algosdk = require('algosdk');

const KmdClient = new algosdk.Kmd(process.env.KMD_TOKEN,
    process.env.KMD_SERVER,
    process.env.KMD_PORT);

const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN,
    process.env.ALGOD_SERVER, process.env.ALGOD_PORT
);
const getWallatHandle = async (wallet_name, wallet_pass) => {
    const { wallets } = (await KmdClient.listWallets());
    return wallets[0];
}

(async ()=> {
console.log(await algodClient("hh","hh"))
})().catch(console.error)