/* eslint-disable */

import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import MyAlgoConnect from "@randlabs/myalgo-connect";

// Contains a list of methods to send transactions via different wallet connectors

const sendAlgoSignerTransaction = async (sdkTx, client) => {
   
    console.log("sdKtx",sdkTx);
    let binaryTx = sdkTx.toByte();
    console.log("🚀 ~ file: wallets.js ~ line 12 ~ sendAlgoSignerTransaction ~ binaryTx", binaryTx)
    let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
    
    let signedTxs = await AlgoSigner.signTxn([
      {
        txn: base64Tx,
      },
    ]);

    let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);

    // Send the transaction through the SDK client
    const response = await client.sendRawTransaction(binarySignedTx).do();
    return response ;


};

const sendWalletConnectTransaction = async (connector, txn, algodClient) => {
    // write your code here
};

const sendMyAlgoTransaction = async (txn, algodClient) => {
    // write your code here
};

export default {
    sendWalletConnectTransaction,
    sendMyAlgoTransaction,
    sendAlgoSignerTransaction,
};
