# Stateful smart contract assignment

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
