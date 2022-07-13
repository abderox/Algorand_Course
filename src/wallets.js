/* eslint-disable */

import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import MyAlgoConnect from "@randlabs/myalgo-connect";

// Contains a list of methods to send transactions via different wallet connectors

const sendAlgoSignerTransaction = async (txn, algodClient) => {
    // write your code here
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
