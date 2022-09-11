# :pushpin: Algorand_Course
# :computer: Course from [algofoundry](https://courses.algofoundry.studio/)

## Author

- ## :eyeglasses: [abderox](https://github.com/abderox/)

## :bookmark_tabs: __Lesson 10__

#### In this assignment I discovered a bit how to deal with testing with smart contracts . 

# Test cases assignment
In this assignment, you are required to write some test cases for the stateful smart contract. This contract is based on the previous assignment.

Write positive test cases to ensure that the smart contract works in the intended way and negative test cases to ensure transactions are rejected if they do fail the logic checks within the contract.

## Positive test cases
Complete the code in `test/success_flow.js`. Write test cases to cover these scenarios,

### Deploys game contract successfully 
1. Initial monster health is same as the value specified during deployment.
2. Initial max damage is set to 0.

### Account opts in successfully
1. Initial player damage is set to 0.

### Attacks monster successfully
1. Max damage and monster health is updated.
2. Player damage is updated
3. Highest player damage address is recorded.

### Reward player successfully
1. MVP player receives the reward.

## Negative test cases
Complete the code in `test/negative_tests.js`. Write test cases to cover these scenarios,

1. Initialize monster with < 5 Health fails.
2. Double opt in fails.
3. Attacking a monster with 0 health fails.
4. Reward player when monster is alive.
5. Reward player fails when address is accounts is different from global state.
6. Reward player fails when called by non-creator

Feel free to include additional test cases if necessary.

To run tests,
```
yarn run algob test
```

## Hints
The testing module in AlgoBuilder uses a npm module called chai. Refer to the following links for API documentation and guides.

1. [Example Projects with Test Cases](https://github.com/scale-it/algo-builder/tree/master/examples)
2. [Algo Builder Testing Guide](https://algobuilder.dev/guide/testing-teal.html)
3. [Algo Builder Runtime API](https://algobuilder.dev/api/runtime/)
4. [Chai Module](https://www.chaijs.com/api/)

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

### 3. Use .env file
```
source .env
```
