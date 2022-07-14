/* eslint-disable */

import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import MyAlgoConnect from "@randlabs/myalgo-connect";
const myAlgoWallet = new MyAlgoConnect();
// Contains a list of methods to send transactions via different wallet connectors

const sendAlgoSignerTransaction = async (sdkTx, client) => {

    console.log("sdKtx", sdkTx);
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
    return response;


};

const sendWalletConnectTransaction = async (connector, txn, algodClient) => {
   
    const txns = [txn];
    console.log("🚀 ~ file: wallets.js ~ line 41 ~ sendWalletConnectTransaction ~ txns", txns)
    const txnsToSign = txns.map((txn) => {
        const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
        console.log("🚀 ~ file: wallets.js ~ line 44 ~ txnsToSign ~ encodedTxn", encodedTxn)

        return {
            txn: encodedTxn,
            message: "Description of transaction being signed",
            // signers: [],
        };
    });
    console.log("🚀 ~ file: wallets.js ~ line 51 ~ txnsToSign ~ txnsToSign", txnsToSign)

    const requestParams = [txnsToSign];
    console.log("🚀 ~ file: wallets.js ~ line 55 ~ sendWalletConnectTransaction ~ requestParams", requestParams)

    const request = formatJsonRpcRequest("algo_signTxn", requestParams);
    console.log("🚀 ~ file: wallets.js ~ line 58 ~ sendWalletConnectTransaction ~ request", request)
    const result = await connector.sendCustomRequest(request);
    console.log("🚀 ~ file: wallets.js ~ line 60 ~ sendWalletConnectTransaction ~ result", result)
    const decodedResult = result.map((element) => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
    });
    console.log("🚀 ~ file: wallets.js ~ line 64 ~ decodedResult ~ decodedResult", decodedResult)

    const response = await algodClient.sendRawTransaction(decodedResult).do();
    console.log(response);

    return response;
};

const sendMyAlgoTransaction = async (txn, algodClient) => {
    const signit = await myAlgoWallet.signTransaction(txn.toByte());

    const response = await algodClient.sendRawTransaction(signit.blob).do()
    console.log("🚀 ~ file: wallets.js ~ line 36 ~ sendMyAlgoTransaction ~ response", response)
    return response;
};

export default {
    sendWalletConnectTransaction,
    sendMyAlgoTransaction,
    sendAlgoSignerTransaction,
};
