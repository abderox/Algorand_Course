const { executeTransaction } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");

async function run (runtimeEnv, deployer) {
  // accounts involved
  const master = deployer.accountsByName.get("master");
  const acc1 = deployer.accountsByName.get("acc1");
  const acc2 = deployer.accountsByName.get("acc2");
  

  // supply params to program during compilation - not the same as passing arguments
  const templateParams = {
    RECEVIER_1: acc1.addr,
    RECEIVER_2: acc2.addr
  }
  
  // create logic sig for sender account
  const masterLogicSig = await deployer.mkDelegatedLsig(
    "pyteal_program.py",
    master,
    templateParams
  );
  console.log("🚀 ~ file: main.js ~ line 23 ~ run ~ masterLogicSig", masterLogicSig)

 
  // send Algos to acc1
  console.log("send algos to acc1...")
  await executeTransaction(deployer, {
      type: types.TransactionType.TransferAlgo,
      sign: types.SignType.LogicSignature,
      lsig: masterLogicSig.lsig,
      fromAccountAddr: masterLogicSig.contractAddress,
      toAccountAddr: acc1.addr,
      amountMicroAlgos: 1e6, //1 algo
      payFlags: { totalFee: 1000 },
      args: ["rcv1password"],
  });

  // send Algos to acc2
  console.log("send algos to acc2...")
  await executeTransaction(deployer, {
      type: types.TransactionType.TransferAlgo,
      sign: types.SignType.LogicSignature,
      lsig: masterLogicSig.lsig,
      fromAccountAddr: masterLogicSig.contractAddress,
      toAccountAddr: acc2.addr,
      amountMicroAlgos: 1e6, //1 algo
      payFlags: { totalFee: 1000 },
      args: ["rcv2password"]
  });

}

module.exports = { default: run };
