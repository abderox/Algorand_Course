const algosdk = require('algosdk');
const dotenv = require('dotenv');
dotenv.config()
const genStAcc = require('./account_standalone');



const algodClient = new algosdk.Algodv2(
    process.env.ALGOD_TOKEN,
    process.env.ALGOD_SERVER, process.env.ALGOD_PORT
)


const provideAlgos = async (sender, receiver, amount) => {
    
    const suggestedParams = await algodClient.getTransactionParams().do();
  
    let txn = algosdk.makePaymentTxnWithSuggestedParams(
      sender.addr,
      receiver.addr,
      amount,
      undefined,
      undefined,
      suggestedParams
    );
  
    // sign the transaction
    const signedTxn = txn.signTxn(sender.sk);
  
    let tx = await algodClient.sendRawTransaction(signedTxn).do();

    let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
    //Get the completed Transaction
    console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
    console.log("Transaction information: %o", mytxinfo);
  };

    (async () => {

        let acc_C = await genStAcc.generateStandaloneAccount()
        let acc_B = await genStAcc.generateStandaloneAccount()
        let acc_A = await genStAcc.generateStandaloneAccount()
        
        provider = algosdk.mnemonicToSecretKey(process.env.KMD_MNEMONIC_WALLET);
        console.log("🚀 ~ file: rekey.js ~ line 46 ~ provider", provider)

        await provideAlgos(provider,acc_C,1e6)
        await provideAlgos(provider,acc_B,1e6)
        await provideAlgos(provider,acc_A,1e6)

        const params = {
            version: 1,
            threshold: 1,
            addrs: [
                acc_B.addr,
                acc_C.addr,
            ],
        };

        let multisigAddr = algosdk.multisigAddress(params);
        console.log("🚀 ~ file: account_multisig.js ~ line 23 ~ multisigAddr", multisigAddr);

        // let txn_ = algosdk.makePaymentTxnWithSuggestedParams({
        //     from: "DCYMPMBCJR3DTZHKTISRUOCUTJ5V2XLBGYMVKROQFP3RZD5SNKDSJPDFEY",
        //     to: acc_A.addr,
        //     amount: 105000,
        // });
        // let signedTxn_ = txn.signTxn(myAccount.sk);
        // await algodClient.sendRawTransaction(signedTxn_).do();

        
        let suggestedParams = await algodClient.getTransactionParams().do();
        let txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            from: acc_A.addr,
            to: acc_B.addr,
            amount: 0,
            suggestedParams: suggestedParams,
            rekeyTo: multisigAddr
          });

        let signedTxn = txn.signTxn(acc_A.sk);
        let txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);
        let tx = await algodClient.sendRawTransaction(signedTxn).do();

        let confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);
        //Get the completed Transaction
        console.log("Transaction " + tx.txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
        console.log("Transaction information: %o", mytxinfo);
        
        console.log("Sending Algos from A to B...");

        
        let payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: acc_A.addr,
          to: acc_B.addr,
          amount: 1e5, // 0.1 Algos
          suggestedParams: suggestedParams,
        });
        let rawSignedTxn = algosdk.signMultisigTransaction(payTxn, params, acc_C.sk).blob;
        console.log("🚀 ~ file: rekey.js ~ line 103 ~ rawSignedTxn", rawSignedTxn)
        
        let tx_= await algodClient.sendRawTransaction(rawSignedTxn).do();
        console.log("🚀 ~ file: rekey.js ~ line 106 ~ tx_", tx_)

        let confirmedTxn_ = await algosdk.waitForConfirmation(algodClient, tx_.txId, 4);
        //Get the completed Transaction
        console.log("Transaction " + tx_.txId + " confirmed in round " + confirmedTxn_["confirmed-round"]);
        let mytxinfo_ = JSON.stringify(confirmedTxn_.txn.txn, undefined, 2);
        console.log("Transaction information: %o", mytxinfo_);
      
        console.log("Account A balance: ", (await algodClient.accountInformation(acc_A.addr).do()).amount);
        console.log("Account B balance: ", (await algodClient.accountInformation(acc_B.addr).do()).amount);

    })().catch(console.error)


