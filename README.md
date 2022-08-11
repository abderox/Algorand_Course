# :pushpin: Algorand Developer Course
# :computer: Course from [algofoundry](https://courses.algofoundry.studio/)

## Author

- ## :eyeglasses: [abderox](https://github.com/abderox/)

#### :shit: It is better to work on wsl environment , working with any distribution of linux if working on windows machines . Sometimes words can not describe how poor is windows !! 
## :bookmark_tabs: __Lesson 7__
#### In this assignment I learnt how to write in pyteal (python library)  





# PyTeal assignment

In this assignment, you will be tasked to complete the PyTeal stateless program in `artifacts/pyteal_program.py` that checks the transactions performed in `scripts/main.js`.

The transaction performed is a simple Algo transfer from `master` account to accounts `acc1` and `acc2`.

A password would be supplied as a argument to the stateless program during transaction execution. The program should contain the following logic,

1. Transaction should not have a rekey to address or close remainder to address.
2. If the transaction receiver is `acc1` address, the password should be `rcv1password`. The transacted amount should not be above 5 Algos.
3. If the transaction receiver is `acc2` address, the password should be `rcv2password`. The transacted amount should not be above 10 Algos.

To test your PyTeal program, change the transaction amount, receiver account addresses or password and see if your program rejects the transaction.

## Setup instructions

### 1. Install packages
```
yarn install
```

### 2. Update environement variables
1. Copy `.env.example` to `.env`.
2. Update Algorand Sandbox credentials in `.env` file. You will need 3 accounts for this assignment.

### 3. Update `algob.config.js`
1. Update the account credentials. You will need 3 accounts, `master`, `acc1` and `acc2`.

### 4. Use .env file
```
source .env
```

### 4. Run program
```
yarn run algob deploy scripts/main.js
```

### 5. Clear deployment cache
```
yarn run algob clean
```
