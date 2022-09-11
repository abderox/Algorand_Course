const { convert } = require("@algo-builder/algob");
const { types } = require("@algo-builder/web");
const { Runtime, AccountStore } = require("@algo-builder/runtime");
const { assert } = require("chai");
const algosdk = require("algosdk");

describe("Stateful Smart Contract Negative Tests", function () {
    let master = "";
    let player = "";
    let runtime = null;

    const approvalFile = "game_approval.py";
    const clearStateFile = "game_clearstate.py";

    this.beforeEach(async function () {
        master = new AccountStore(5e7, "master");
        player = new AccountStore(1e7, "player");

        runtime = new Runtime([master, player]);

    })

    const monsterHealth = 0;

    const initGameContract = () => {
        runtime.deployApp(
            approvalFile,
            clearStateFile,
            {
                sender: master.account,
                localInts: 1,
                localBytes: 0,
                globalInts: 2,
                globalBytes: 1,
                appArgs: [convert.uint64ToBigEndian(monsterHealth)],
            },
            { totalFee: 1000 }
        )

        const gameApp = runtime.getAppInfoFromName(approvalFile, clearStateFile);

        runtime.executeTx(
            {
                type: types.TransactionType.TransferAlgo,
                sign: types.SignType.SecretKey,
                fromAccount: master.account,
                toAccountAddr: gameApp.applicationAccount,
                amountMicroAlgos: 2e7,
                payFlags: { totalFee: 1000 },
            })


        return [gameApp, gameApp.appID];
    }



    it("should not deploy the game health < 5", function () {
        assert.throws(() => { initGameContract() }, "RUNTIME_ERR1009: TEAL runtime encountered err opcode");
     // integer check
    });

    


});
