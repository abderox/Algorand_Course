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
// console.log("🚀 ~ file: clawback.js ~ line 12 ~ creator", creator.addr)

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

const TransferOrRecieveAsset = async (args, clawback = null) => {


    const defaultParams = { sender: null, receiver: null, assetID: undefined, amount: 0 }
    const objParams = { ...defaultParams, ...args }
    // console.log("🚀 ~ file: clawback.js ~ line 85 ~ TransferOrRecieveAsset ~ objParams", objParams)

    recipient = (clawback === null) ? objParams.receiver.addr : clawback.addr;
    revocationTarget = (clawback === null) ? undefined : objParams.receiver.addr;
    closeRemainderTo = undefined;
    note = undefined;

    //console.log(objParams.sender,objParams.sender===null);
    let sender = (objParams.sender === null) ? objParams.receiver : objParams.sender;
    // console.log("🚀 ~ file: clawback.js ~ line 91 ~ TransferOrRecieveAsset ~ sender", sender)


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
    // console.log("🚀 ~ file: clawback.js ~ line 107 ~ TransferOrRecieveAsset ~ xtxn", xtxn)

    
    await printAssetHolding(algodClient, sender, objParams.assetID);
    return xtxn;


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
    // console.log("🚀 ~ file: clawback.js ~ line 94 ~ assetID ", assetID)

    console.log(`💥 NFT created. Asset ID is ${assetID}`);
    return assetID;

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

const TransactionTxn = async (sender, receiver, amount) => {

    const suggestedParams = await algodClient.getTransactionParams().do();

    let txn = algosdk.makePaymentTxnWithSuggestedParams(
        sender.addr,
        receiver.addr,
        amount,
        undefined,
        undefined,
        suggestedParams
    );
    console.log("🚀 Transaction from sender", sender.addr, txn, "to", receiver.addr, "amount", amount)
    return txn;
};

(async () => {

    let artist = await genStAcc.generateStandaloneAccount(); // B is the reciever account
    let buyer = await genStAcc.generateStandaloneAccount(); //A is the clawback account

    await provideAlgos(creator, artist, 1e6);// ? provide both accounts with 1 Algo
    await provideAlgos(creator, buyer, 2e6); // ? 1 Algo

    const assetID = await AssetCreation(creator); // ? we create an asset from file received by the artist
    const buyerToCreator = await TransactionTxn(buyer, creator, 1e6); // ! the buyer pays the creator

    const buyer_opt_in_tx=await TransferOrRecieveAsset({ receiver: buyer, assetID: assetID });
    const creator_asset_to_buyer_tx =await TransferOrRecieveAsset({ sender: creator, receiver: buyer, assetID: assetID, amount: 1 });

    const creatorToArtist = await TransactionTxn(creator, artist, 1e6 * 0.1); // ! the creator pays the artist   

    // ! ATOMIC TRANSFERS BEGAN
    let txns = [buyerToCreator, buyer_opt_in_tx,creator_asset_to_buyer_tx,creatorToArtist];
    let txgroup = algosdk.assignGroupID(txns);
    console.log("🚀 ~ file: atomic.js ~ line 185 ~ txgroup", txgroup)

    let signTxn = []
    signTxn.push(buyerToCreator.signTxn(buyer.sk));
    signTxn.push(buyer_opt_in_tx.signTxn(buyer.sk));
    signTxn.push(creator_asset_to_buyer_tx.signTxn(creator.sk));
    signTxn.push(creatorToArtist.signTxn(creator.sk));

    await submitToNetwork(signTxn);

    console.log("😍 Account buyer   ", (await algodClient.accountInformation(buyer.addr).do()));
    console.log("😁 Account creator  ", (await algodClient.accountInformation(creator.addr).do()));
    console.log("🎨 Account artist  ", (await algodClient.accountInformation(artist.addr).do()));

})();