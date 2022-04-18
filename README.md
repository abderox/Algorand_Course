# Stateful smart contract assignment
In this assignment, you will be tasked to complete a stateful smart contract that tracks a counter in the global storage. You will then need to deploy the app and interact with it.

## Stateful contract
1. Complete the code in `assets\sc_approval.py` so the smart contract is able to add or deduct the counter value in the global storage. You will need to initialize the counter value to 0 first.

## Smart contract deployment
1. Complete the code in the `scripts\stateful.js`. You will need to do the following,
    - Deploy the smart contract
    - Call the "Add" function from the smart contract
    - Call the "Deduct" function from the smart contract
    - Delete the smart contract

## Setup instructions

### 1. Install packages
```
yarn install
```

### 2. Update environement variables
1. Copy `.env.example` to `.env`.
2. Update Algorand Sandbox credentials in `.env` file.

### 3. Update `algob.config.js`
1. Update the master account credentials

### 4. Use .env file
```
source .env
```

### 5. Algo Builder deployment commands
```
# Compile smart contracts
yarn run algob compile

# Run all deployment scripts
yarn run algob deploy

# Cleanup artifacts folder
yarn run algob clean

# Run one deployment script
yarn run algob deploy scripts/<filename>
```
