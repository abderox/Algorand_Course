<template>
    <div id="sendalgo-app">
        <h3>Select wallet</h3>
        <div class="d-grid gap-2 mb-5">
            <button @click="connectMyAlgo" class="btn btn-primary">MyAlgo</button>
            <button @click="connectToAlgoSigner('localhost')" class="btn btn-primary">AlgoSigner (Localhost)</button>
            <button @click="connectToAlgoSigner('TestNet')" class="btn btn-primary">AlgoSigner (TestNet)</button>
            <button @click="connectToWalletConnect" class="btn btn-primary mr-3">WalletConnect</button>
        </div>
        <div v-if="this.sender !== ''" class="mb-5">
            <h3>Connected</h3>
            <p>
                Connection: <span>{{ this.connection }}</span>
            </p>
            <p>
                Network: <span>{{ this.network }}</span>
            </p>
            <p>
                Account: <span>{{ this.sender }}</span>
            </p>
        </div>
        <send-algo-form v-if="this.sender !== ''" :connection="this.connection" :walletConnector="this.connector"
            :network="this.network" :sender="this.sender" :receiver="this.receiver" />
    </div>
</template>

<script>
/* eslint-disable */

import MyAlgoConnect from "@randlabs/myalgo-connect";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
const myAlgoWallet = new MyAlgoConnect();

export default {
    data() {
        return {
            connection: "", // myalgo | walletconnect | algosigner
            connector: null, // wallet connector obj
            network: "", // Localhost | TestNet
            sender: "", // connected account
            receiver: "",
        };
    },
    methods: {
        async connectMyAlgo() {
            this.network = "TestNet";
            try {
                const accounts = await myAlgoWallet.connect();
                console.log("🚀 ~ file: WalletDemoView.vue ~ line 50 ~ connectMyAlgo ~ accounts", accounts)
                const account = accounts[0].address;
                console.log("🚀 ~ file: WalletDemoView.vue ~ line 52 ~ connectMyAlgo ~ account", account)
                const addresses = accounts.map(account => account.address);
                console.log("🚀 ~ file: WalletDemoView.vue ~ line 54 ~ connectMyAlgo ~ addresses", addresses)

                this.sender = account;
                this.receiver = "WUEHUY2BDHVSS4CKCVHV2YGZW25I6R5GUBZS4B3UMK5FLN4LNR2RED5LDE";
                this.connection = "myalgo";

            } catch (err) {
                console.error(err);
            }


        },
        async connectToAlgoSigner(network) {
            this.network = network;

            if (typeof AlgoSigner !== undefined) {

                AlgoSigner.connect()

                    .then(() => AlgoSigner.accounts({
                        ledger: network
                    }))
                    .then((accountData) => {

                        console.log(accountData[0].address);
                        this.sender = accountData[0].address;

                        if (network == "localhost") {
                            this.sender = accountData[1].address;
                            this.receiver = accountData[0].address;

                        }
                        else {
                            this.sender = accountData[0].address;
                            this.receiver = "RQIZ5I7ERCA44ZX4Q7SIP4HDTUC6O244KCHJSABII2P4236JZHTPCUAMYM";
                        }
                    })
                    .catch((e) => {

                        console.error(e);
                    })
            }


            this.connection = "algosigner";
        },
        async connectToWalletConnect() {
            this.network = "TestNet";


            this.connector = new WalletConnect({
                bridge: "https://bridge.walletconnect.org", // Required
                qrcodeModal: QRCodeModal,
            });

            // Check if connection is already established
            if (this.connector.connected) {
                // kill  session
                await this.connector.killSession();
            }
            this.connector.createSession();


            // Subscribe to connection events
            this.connector.on("connect", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Get provided accounts and chainId
                const { accounts, chainId } = payload.params[0];
                console.log(accounts, chainId);
                this.connection = "WalletConnect";
                this.sender = accounts[0];
                this.receiver = "RQIZ5I7ERCA44ZX4Q7SIP4HDTUC6O244KCHJSABII2P4236JZHTPCUAMYM";
            });

            this.connector.on("session_update", (error, payload) => {
                if (error) {
                    throw error;
                }

                // Get updated accounts and chainId
                const { accounts, chainId } = payload.params[0];
                console.log(accounts, chainId);
                this.connection = "WalletConnect";
                this.sender = accounts[0];
                this.receiver = "RQIZ5I7ERCA44ZX4Q7SIP4HDTUC6O244KCHJSABII2P4236JZHTPCUAMYM";
            });

            this.connector.on("disconnect", (error, payload) => {
                if (error) {
                    throw error;
                }

                this.connection = "";
            });

            
        },
    },
};
</script>
