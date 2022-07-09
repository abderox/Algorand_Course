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

    let confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
    //Get the completed Transaction
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
    console.log("Transaction information: %o", mytxinfo);
  };

    (async () => {

        let acc_C = await genStAcc.generateStandaloneAccount()
        let acc_B = await genStAcc.generateStandaloneAccount()
        let acc_A = await genStAcc.generateStandaloneAccount()
        
        provider = algosdk.mnemonicToSecretKey(process.env.MNEMONIC_CREATOR);
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

    
        let txn = algosdk.makePaymentTxnWithSuggestedParams({
            from: acc_A.addr,
            to: acc_B.addr,
            amount: 0,
            rekeyTo: multisigAddr
        });

        let signedTxn = txn.signTxn(acc_A.sk);
        let txId = txn.txID().toString();
        console.log("Signed transaction with txID: %s", txId);
        let tx = await algodClient.sendRawTransaction(signedTxn).do();

        let confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
        //Get the completed Transaction
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
        let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
        console.log("Transaction information: %o", mytxinfo);
        
        console.log("Sending Algos from A to B...");

        let param_ = await algodClient.getTransactionParams().do();
        let payTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: acc_A.addr,
          to: acc_B.addr,
          amount: 1e5, // 0.1 Algos
          suggestedParams: param_,
        });
        let rawSignedTxn = algosdk.signMultisigTransaction(payTxn, param_, acc_C.sk).blob;
        await algodclient.sendRawTransaction(rawSignedTxn).do();

        let confirmedTxn_ = await waitForConfirmation(algodClient, txId, 4);
        //Get the completed Transaction
        console.log("Transaction " + txId + " confirmed in round " + confirmedTxn_["confirmed-round"]);
        let mytxinfo_ = JSON.stringify(confirmedTxn_.txn.txn, undefined, 2);
        console.log("Transaction information: %o", mytxinfo_);
      
      

    })().catch(console.error)


