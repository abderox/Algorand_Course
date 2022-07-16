# :pushpin: Algorand_Course

## Author

- ## :eyeglasses: [abderox](https://github.com/abderox/)

#### :shit: Same remark  !! 
## :bookmark_tabs: __Lesson 3__

## Asset clawback assignment
- ## :computer: [assignment](https://github.com/Algo-Foundry/asset-clawback)

Perform an asset clawback from one account to another. You are required to do the following,

1. Create the asset. It can be an NFT or a fungible token.
2. Send this asset to an account.
3. Perform a clawback of this asset and send it to another account.

Write your solution in the skeleton code provided in `clawback.js`

### Setup instructions
1. Install packages with `npm install`.
2. Copy `.env copy` to `.env`.
3. Add account information (address and mnemonic) into the `.env` file.


### Get account mnemonic
To get the mnemonic of an account in goal CLI, replace the `<account address>` run this command in your sandbox directory.
```
./sandbox goal account export -a <account address>
```

### Running your script
2. Run your script with `node clawback.js`.


## Atomic transfers assignment
- ## :computer: [assignment](https://github.com/Algo-Foundry/atomic-transfers)

Create an asset (NFT or fungible token). After which, create an atomic transfer that consists of the following transactions,

1. Buyer account pays 1 Algo to the creator.
2. Buyer opts into the asset. 
3. Creator sends the NFT to the buyer.
4. Creator sends 10% of the payment to the artist's account.
 
You can assume that the buyer and artist accounts are standalone accounts.

### Setup instructions
1. Install packages with `npm install`.
2. Copy `.env copy` to `.env`.
3. Add account information (address and mnemonic) into the `.env` file.

### Get account mnemonic
To get the mnemonic of an account in goal CLI, replace the `<account address>` run this command in your sandbox directory.
```
./sandbox goal account export -a <account address>
```

### Running your script
Run your script with `node atomic.js`.

