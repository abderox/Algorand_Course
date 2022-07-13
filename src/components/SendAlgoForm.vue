<template>
    <div id="sendalgo" class="mb-5">
        <h3>Sending Algos</h3>
        <div v-if="this.txId !== ''" class="alert alert-success" role="alert">
            Txn Ref: <a :href="explorerURL" target="_blank">{{ this.txId }}</a>
        </div>
        <form v-if="this.sender !== ''" action="#" @submit.prevent="sendAlgos">
            <div class="mb-3">
                <label for="amount" class="form-label">microAlgos to send</label>
                <input type="number" class="form-control" id="amount" v-model="amount" />
            </div>
            <div class="mb-3">
                <label for="receiver" class="form-label">Receiver</label>
                <input type="string" class="form-control" id="receiver" v-model="receiverAddr" />
            </div>
            <button type="submit" class="btn btn-primary">Send</button>
        </form>
    </div>
</template>

<script>
import algosdk from "algosdk";
import sendalgos from "../sendalgos.js";
import WalletConnect from "@walletconnect/client";


export default {
    props: {
        connection: String,
        walletConnector: WalletConnect,
        network: String,
        sender: String,
        receiver: String,
    },
    data() {
        return {
            txId: "",
            receiverAddr: "",
            amount: algosdk.algosToMicroalgos(0.1),
            explorerURL: "",
        };
    },
    watch: {
        receiver: function (newVal) {
            // updates receiver address on connector change
            this.receiverAddr = newVal;
    
        
        },
    },
    methods: {
        async sendAlgos() {
            let response;

            switch (this.connection) {
                case "algosigner":
                    response = await sendalgos.viaAlgoSigner(this.sender, this.receiverAddr, this.amount, this.network);
                    break;
                case "walletconnect":
                    response = await sendalgos.viaWalletConnect(
                        this.walletConnector,
                        this.sender,
                        this.receiverAddr,
                        this.amount,
                        this.network
                    );
                    break;
                case "myalgo":
                    response = await sendalgos.viaMyAlgo(this.sender, this.receiverAddr, this.amount, this.network);
                    break;
                default:
                    break;
            }

            if (response !== undefined) {
                this.txId = response.txId;
                this.setExplorerURL(response.txId);
            }
        },
        setExplorerURL(txId) {
            switch (this.network) {
                case "TestNet":
                    this.explorerURL = "https://testnet.algoexplorer.io/tx/" + txId;
                    break;
                default:
                    this.explorerURL = "http://localhost:8980/v2/transactions/" + txId + "?pretty";
                    break;
            }
        },
    },
    async mounted() {
        this.receiverAddr = this.receiver;
    },
};
</script>
