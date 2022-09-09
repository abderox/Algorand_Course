# :pushpin: Algorand Developer Course
# :computer: Course from [algofoundry](https://courses.algofoundry.studio/)

## Author

- ## :eyeglasses: [abderox](https://github.com/abderox/)


## :bookmark_tabs: __Lesson 8__
#### In this assignment I learnt how to write a smart contract working with (HTLC) `HashTimeLockedContracts`



# Stateless smart contract assignment

In this assignment, you will be tasked to write a [hashed time lock contract (htlc)](https://en.bitcoin.it/wiki/Hash_Time_Locked_Contracts). You will also need to test this contract by sending transactions to withdraw funds from it.

Essentially, this is a stateless smart contract that only allows accounts to withdraw funds from it if a secret is supplied. This secret is usually given by the creator. The contract creator can also recover the funds from this contract after a certain period of time.

### Stateless contract
Complete the code in `assets/htlc.py` so that this stateless smart contract performs basic checks for all transactions and does either fund withdrawal check or fund recovery check.

#### Basic checks
1. `rekey to` and `close remainder to` addresses are not found in the transaction.
2. Transaction is a payment type transaction.

#### Fund withdrawal checks
1. Receiver is `acc2` address.
2. Correct secret supplied. This secret is a base64 encoded sha256 hash of this set of words `secret random set of words here`.

#### Fund recovery check
1. Receiver is `acc1` address.
2. Current block round is past the `timeout` value supplied. For simplicity sake, assume `timeout` value is `50` rounds ahead of the block round when the contract account is first created.

### Contract deployment
Complete the code in `scripts/htlc.js` to fund this stateless smart contract. Calculate the timeout value and update the contract's template parameters before deployment. Save the timeout as a checkpoint key value pair for later use. The reason for this is because you need to supply the same template parameters whenever you need to compile the program and submit transactions with it.

The contract's template parameters are created via `scripts/withdraw/common.js`. You can retrieve them via `prepareParameters()`.

To deploy the contract
```
yarn run algob deploy scripts/htlc.js
```

To clear the cache
```
yarn run algob clean
```

### Withdrawal
Complete the code in `scripts/actions/withdraw.js` to perform the withdrawal transaction of 1 Algo from the contract to `acc2`.

Test the following scenarios,
1. Send transaction with a wrong secret.
2. Send transaction with a correct secret.

To run the withdrawal script
```
yarn run algob run scripts/actions/withdraw.js
```

### Recover Fund
Complete the code in `scripts/actions/recover_fund.js`. The contract account should attempt to send 1 Algo to `acc1`, which will be rejected unless 50 block rounds passed.

To run the fund recovery script
```
yarn run algob run scripts/actions/recover_fund.js
```

### Hints
Refer to the following links for documentation,
1. [Algo Builder API](https://algobuilder.dev/api/algob/index.html)
2. [Algo Builder Transaction Syntax](https://github.com/scale-it/algo-builder/blob/master/docs/guide/execute-transaction.md)
3. [Algo Builder checkpoints](https://algobuilder.dev/guide/execution-checkpoints.html)

## Setup instructions

### 1. Install packages
```
yarn install
```

### 2. Update environement variables
1. Copy `.env.example` to `.env`.
2. Update Algorand Sandbox credentials in `.env` file.

### 3. Use .env file
```
source .env
```
