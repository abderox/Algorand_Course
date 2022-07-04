const { default: algosdk } = require("algosdk");
require('dotenv').config();

var param = ""
log_algoclient_response = console.log.bind(param)


const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN,
    process.env.ALGOD_SERVER, process.env.ALGOD_PORT
);


// ? account status
(async () => {
    log_algoclient_response(await algodClient.status().do())
})().catch(console.error);

// ? account info
(async () => {
    let accountInfo = await algodClient.accountInformation(process.env.ADDR_CREATOR).do();
    // ? Check your balance
    log_algoclient_response("Account balance: %d microAlgos", accountInfo.amount);
})().catch(console.error);

