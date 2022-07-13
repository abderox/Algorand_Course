# Wallet connector assignment

Complete the wallet connector integration for this sample Dapp. A user should be able to connect to either AlgoSigner, MyAlgo or WalletConnect (with Pera wallet) and perform a payment transaction to another account.

You will need to fill in the wallet integration codes in `wallets.js` and `WalletDemoView.vue`.

## Setup instructions

### 1. Install packages
```
yarn install
```

### 2. Update environement variables
1. Copy `.env.example` to `.env`.
2. Add account information (address and mnemonic) into the `.env` file.

#### Get account mnemonic
To get the mnemonic of an account in goal CLI, replace the `<account address>` run this command in your sandbox directory.
```
./sandbox goal account export -a <account address>
```

### 3. Setup wallets and test accounts
#### AlgoSigner
1. Download [AlgoSigner browser extension](https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm)
2. Create wallet and accounts on TestNet
3. Integration docs can be found [here](https://github.com/PureStake/algosigner)

#### Add private network to AlgoSigner
1. Follow the instructions [here](https://github.com/PureStake/algosigner/blob/develop/docs/add-network.md) on how to add private network (a.k.a Algorand Sandbox) on AlgoSigner. These are the fields to be added
```
# Display name
Localhost

# Network ID
sandnet-v1

# Network Algod URL
http://localhost:4001

# Network Indexer URL
http://localhost:8980

# Network Headers
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
```

#### MyAlgo Wallet
1. [Library](https://github.com/randlabs/myalgo-connect) is included in this project
2. Create TestNet accounts on [MyAlgo](https://wallet.myalgo.com/home)

#### WalletConnect
1. [Library](https://docs.walletconnect.com/quick-start/dapps/client) is included in this the project
2. Integration docs can be found [here](https://developer.algorand.org/docs/get-details/walletconnect/#sign-transaction)

#### Pera Wallet
1. Download [Pera Wallet](https://perawallet.app/)
2. Create TestNet accounts under your Pera Wallet.
3. When performing transactions using Pera Wallet, please switch the node settings to TestNet. This can be done via `Settings > Developer Settings > Node Settings > TestNet`

#### Fund TestNet accounts
1. Use the [faucet](https://bank.testnet.algorand.network/) to fund your TestNet accounts. You will need to have some funds to maintain account balance and pay transaction fees.

### 4. Use the .env file
```
source .env
```

### 5. Run the Dapp on localhost
```
yarn serve
```
