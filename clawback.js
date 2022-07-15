const algosdk = require("algosdk");
const genStAcc = require('./standalone_account.js');
const dotenv = require("dotenv");
dotenv.config();

const algodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN,
  process.env.ALGOD_SERVER,
  process.env.ALGOD_PORT
);

const creator = algosdk.mnemonicToSecretKey(process.env.MNEMONIC_CREATOR);
console.log("🚀 ~ file: clawback.js ~ line 12 ~ creator", creator.addr)

const submitToNetwork = async (signedTxn) => {
  // send txn
  let tx = await algodClient.sendRawTransaction(signedTxn).do();
  console.log("Transaction : " + tx.txId);

  // Wait for transaction to be confirmed
  confirmedTxn = await algosdk.waitForConfirmation(algodClient, tx.txId, 4);

  //Get the completed Transaction
  console.log(
    "Transaction " +
    tx.txId +
    " confirmed in round " +
    confirmedTxn["confirmed-round"]
  );

  return confirmedTxn;
};

const AssetCreation = async (creator, clawback) => {

  let clawback = clawback || creator;
  let params = await algodClient.getTransactionParams().do();

  let addr = creator.addr;
  // Whether user accounts will need to be unfrozen before transacting    
  let defaultFrozen = false;
  // integer number of decimals for asset unit calculation
  let decimals = 0;
  // total number of this asset available for circulation   
  let total = 1;
  // Used to display asset units to user    
  let unitName = "ROX";
  // Friendly name of the asset    
  let assetName = "rox";
  // signing and sending "txn" allows "addr" to create an asset
  const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    total,
    decimals,
    assetName,
    unitName,
    assetURL: "https://gateway.pinata.cloud/ipfs/QmWV5tVDAvATW4VjRycVfqtqNexpooWVyPHsLVqMJSkgCS",
    assetMetadataHash: undefined,
    defaultFrozen,
    freeze: undefined,
    manager: undefined,
    clawback: clawback.addr, // the creator account can perform the clawback
    reserve: undefined,
    suggestedParams: params,
  });

  let rawSignedTxn = txn.signTxn(creator.sk)

  let cofTXN = await submitToNetwork(rawSignedTxn);

  // Get the new asset's information from the creator account
  assetID = cofTXN["asset-index"];
  console.log("🚀 ~ file: clawback.js ~ line 94 ~ assetID ", assetID)
  console.log("💥 Asset created successfully",)

}

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
  
  console.log("🤡",sender.addr, "sent", amount, "algos to", receiver.addr ,"successfully");
};

(async () => {


  let acc_B = await genStAcc.generateStandaloneAccount()
  let acc_A = await genStAcc.generateStandaloneAccount()

  await provideAlgos(creator, acc_A, 1e6)
  await provideAlgos(creator, acc_B, 1e6)

  await AssetCreation(acc_A, acc_A);



  console.log("Account A balance: ", (await algodClient.accountInformation(acc_A.addr).do()).assets);
  console.log("Account B balance: ", (await algodClient.accountInformation(acc_B.addr).do()).assets);

})().catch(console.error)