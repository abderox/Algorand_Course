# :pushpin: Algorand Developer Course
# :computer: Course from [algofoundry](https://courses.algofoundry.studio/)

## Author

- ## :eyeglasses: [abderox](https://github.com/abderox/)

#### :shit: It is better to work on wsl environment , working with any distribution of linux if working on windows machines . Sometimes words can not describe how poor is windows !! 
## :bookmark_tabs: __Lesson 6__
#### In this assignment I learnt how to write in teal language  



# TEAL assignment

In this assignment, you will be tasked to complete the TEAL program in `artifacts/teal_program.teal` that checks the atomic transfer performed in `main.js`.

The atomic transfer includes 2 transactions, the 1st transaction involves sending 1 Algos to the 2nd account. The 2nd transaction involves sending 10% of the 1st transaction amount to the creator account. A password `algorandIsAwesome` is also sent to the program as a transaction argument.

You will need to write a TEAL program to check the following,
1. Password must be `algorandIsAwesome`
2. Creator receives 10% of the 1st transaction amount
3. Receiver for the 2nd transaction should be the creator's address

To test your TEAL program, change the transaction amount, creator's address and see if your program rejects the transaction.

## Setup instructions

### 1. Install packages
```
npm install
```

### 2. Update environement variables
1. Copy `.env.example` to `.env`.
2. Update Algorand Sandbox credentials in `.env` file. You will need 3 accounts for this assignment.

### 3. Use .env file
```
source .env
```

### 4. Run program
```
node js/main.js
```
