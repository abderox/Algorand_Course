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

const AssetCreation = async (creator, clawback = null) => {

  let clawback_ = clawback || creator;
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
    manager: creator.addr,
    clawback: clawback_.addr, // the creator account can perform the clawback
    reserve: undefined,
    suggestedParams: params,
  });

  let rawSignedTxn = txn.signTxn(creator.sk)

  let cofTXN = await submitToNetwork(rawSignedTxn);

  // Get the new asset's information from the creator account
  assetID = cofTXN["asset-index"];
  console.log("🚀 ~ file: clawback.js ~ line 94 ~ assetID ", assetID)

  console.log(`💥 NFT created. Asset ID is ${assetID}`);
  return assetID;

}

const TransferOrRecieveAsset = async (args, clawback = null) => {


  const defaultParams = { sender: null, receiver: null, assetID: undefined, amount: 0 }
  const objParams = { ...defaultParams, ...args }
  console.log("🚀 ~ file: clawback.js ~ line 85 ~ TransferOrRecieveAsset ~ objParams", objParams)

  recipient = (clawback === null) ? objParams.receiver.addr : clawback.addr;
  revocationTarget = (clawback === null) ? undefined : objParams.receiver.addr;
  closeRemainderTo = undefined;
  note = undefined;

  //console.log(objParams.sender,objParams.sender===null);
  let sender = (objParams.sender === null) ? objParams.receiver : objParams.sender;
  console.log("🚀 ~ file: clawback.js ~ line 91 ~ TransferOrRecieveAsset ~ sender", sender)


  params = await algodClient.getTransactionParams().do();

  let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    sender.addr,
    recipient,
    closeRemainderTo,
    revocationTarget,
    objParams.amount,
    note,
    objParams.assetID,
    params);
  console.log("🚀 ~ file: clawback.js ~ line 107 ~ TransferOrRecieveAsset ~ xtxn", xtxn)

  rawSignedTxn = xtxn.signTxn(sender.sk)
  await submitToNetwork(rawSignedTxn);
  await printAssetHolding(algodClient, sender, objParams.assetID);



}

const printAssetHolding = async function (algodclient, account, assetid) {
  let accountInfo = await algodclient.accountInformation(account.addr).do();
  for (idx = 0; idx < accountInfo['assets'].length; idx++) {
    let scrutinizedAsset = accountInfo['assets'][idx];
    if (scrutinizedAsset['asset-id'] == assetid) {
      let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
      console.log("assetholdinginfo = " + myassetholding);
      break;
    }
  }
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
  await submitToNetwork(signedTxn);

  console.log("🤡", sender.addr, "sent", amount, "algos to", receiver.addr, "successfully");
};

const DestroyAsset = async (assetID, creator) => {
  let params = await algodClient.getTransactionParams().do();
  let txn = algosdk.makeAssetDestroyTxnWithSuggestedParams(
    creator.addr,
    undefined,
    assetID,
    params
  );
  const signedTxn = txn.signTxn(creator.sk);
  await submitToNetwork(signedTxn);
  console.log("💥 Asset destroyed");
}

const keypress = async () => {
  process.stdin.setRawMode(true)

  return new Promise(resolve => process.stdin.once('data', async (key) => {
    if (key === '\u0003') {
      
      resolve('Exiting RAW mode');
      process.exit();
    }
    else {
      process.stdin.setRawMode(false)
      resolve('Exiting RAW mode');
    }


  }))
}
(async () => {


  let acc_B = await genStAcc.generateStandaloneAccount(); // B is the reciever account
  let acc_A = await genStAcc.generateStandaloneAccount(); //A is the clawback account

  await provideAlgos(creator, acc_A, 1e6);// ? 1 Algo
  await provideAlgos(creator, acc_B, 1e6); // ? 1 Algo

  console.log("✍️ Asset creation ");
  const assetId = await AssetCreation(creator);
  console.log("⬅️ opt-in to recieve asset ", assetId);
  await TransferOrRecieveAsset({ receiver: acc_B, assetID: assetId });
  console.log("➡️ send asset ", assetId);
  await TransferOrRecieveAsset({ sender: creator, receiver: acc_B, assetID: assetId, amount: 1 });
  console.log("🤡 ⬅️ opt-in to recieve asset clawback ", assetId);
  await TransferOrRecieveAsset({ receiver: acc_A, assetID: assetId });
  console.log("➡️ send asset ", assetId);
  await TransferOrRecieveAsset({ sender: creator, receiver: acc_B, assetID: assetId, amount: 1 }, acc_A);

  console.log("😮‍💨 finally ughh !! ");



  console.log("➡️ Account A assets CLAWBACK  ", (await algodClient.accountInformation(acc_A.addr).do()));
  console.log("⬅️ Account B ASSETS: RECIEVER ", (await algodClient.accountInformation(acc_B.addr).do()));

  console.log('🚿 press anykey to delete the asset ?');
  (await keypress().then((msg) => console.log("👌 ", msg)));
  await DestroyAsset(126, creator);


  console.log("➡️ Account A assets CLAWBACK  ", (await algodClient.accountInformation(acc_A.addr).do()));
  console.log("⬅️ Account B ASSETS: RECIEVER ", (await algodClient.accountInformation(acc_B.addr).do()));

})().catch(console.error)






