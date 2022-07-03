const { default: algosdk } = require("algosdk");
require('dotenv').config();

var param = ""
const log_algoclient_response = console.log.bind(param)


const algodClient = new algosdk.Algodv2(process.env.ALGOD_TOKEN,
    process.env.ALGOD_SERVER, process.env.ALGOD_PORT
);


(async () => {
    log_algoclient_response(await algodClient.status().do())
})().catch(console.error);