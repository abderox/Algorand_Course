import algosdk from "algosdk";
import { getAlgodClient } from "./client.js";
import wallets from "./wallets.js";

const viaAlgoSigner = async (
    senderAddr,
    receiverAddr,
    amount,
    network
) => {
    const algodClient = getAlgodClient(network);
    const txn = await createSendAlgosTxn(
        senderAddr,
        receiverAddr,
        amount,
        algodClient
    );

    return await wallets.sendAlgoSignerTransaction(txn, algodClient);
};

const viaWalletConnect = async (
    connector,
    senderAddr,
    receiverAddr,
    amount,
    network
) => {
    const algodClient = getAlgodClient(network);
    const txn = await createSendAlgosTxn(
        senderAddr,
        receiverAddr,
        amount,
        algodClient
    );

    return await wallets.sendWalletConnectTransaction(connector, txn, algodClient);
};

const viaMyAlgo = async (
    senderAddr,
    receiverAddr,
    amount,
    network
) => {
    const algodClient = getAlgodClient(network);
    const txn = await createSendAlgosTxn(
        senderAddr,
        receiverAddr,
        amount,
        algodClient
    );

    return await wallets.sendMyAlgoTransaction(txn, algodClient);
};

const createSendAlgosTxn = async (
    senderAddr,
    receiverAddr,
    amount,
    algodClient
) => {
    // convert to integer
    const amountParsed = parseInt(amount);
    if (!(senderAddr && receiverAddr && amountParsed) || amountParsed <= 0) {
        console.error("error", senderAddr, receiverAddr, amountParsed);
        return;
    }

    let suggestedParams = await algodClient.getTransactionParams().do();

    let txn = algosdk.makePaymentTxnWithSuggestedParams(
        senderAddr,
        receiverAddr,
        amountParsed,
        undefined,
        undefined,
        suggestedParams,
        undefined
    );

    return txn;
};

export default {
    viaAlgoSigner,
    viaWalletConnect,
    viaMyAlgo,
};
