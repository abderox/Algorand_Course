# Stateful smart contract assignment
In this assignment, you will be tasked to complete stateful smart contract for a game. When the contract is deployed, a monster with a fixed amount of health is created. Participating accounts can attack the monster. The account that does the most damage gets rewarded with Algos. 

## Stateful contract
Complete the code in `assets\game_approval.py`. The smart contract should contain the following functions,

### Initialization
Creates a new monster with a specified amount of 5 health points and above. Also initialize the global state of the highest damage dealt to 0. 

### Opt In
Initialize the local state of the damage done to the monster to 0. You should also prevent the player from making multiple opt in transactions.

### Attack monster
Reduces the monster's health by 2 points if the monster's health is not 0. The player's local state should also keep track of the damage dealt to that monster. The contract will use the local state value to determine if this player did the most damage to the monster.

### Reward player
Send 1 Algos to the player that does the most damage if the monster is dead. This call can only be accessed by the creator.

## Contract deployment
Complete the code in `scripts/deploy_game.js` to deploy contract and fund it with 20 Algos.

To deploy the contract,
```
yarn run algob deploy scripts/deploy_game.js
```

## Calling the smart contract

### Opt-In
Complete the code in `scripts/actions/optIn.js` so that `acc1` is able to participate as a game player.

To opt into the contract,
```
yarn run algob run scripts/actions/optIn.js
```

### Attack
Complete the code in `scripts/actions/attack.js` so that `acc1` can peform an application call to perform attacks on the monster.

To attack the monster,
```
yarn run algob run scripts/actions/attack.js
```

### Reward
Complete the code in `scripts/actions/reward.js` so that the smart contract can dispense reward to the player that does the most damage.

To dispense the reward,
```
yarn run algob run scripts/actions/reward.js
```

## Hints
1. The recipient of an inner transaction must be in the accounts array. This means that you will need to get the best player's address from the global state, convert it to the address string (because it returns as base64 format) and pass it into the accounts array when rewarding the player.

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
