const { convert } = require("@algo-builder/algob");
const { Runtime, AccountStore } = require("@algo-builder/runtime");
const { types } = require("@algo-builder/web");
const { assert } = require("chai");
const algosdk = require("algosdk");

describe("Stateful Smart Contract Positive Tests", function () {
    // write your code here

    let master = "";
    let player = "";
    let runtime = null;

    const approvalFile = "game_approval.py";
    const clearStateFile = "game_clearstate.py";

    this.beforeEach(async function () {
        master = new AccountStore(5e7, "master");
        player = new AccountStore(1e7, "player");

        runtime = new Runtime([master, player]);
        runtime.setRoundAndTimestamp(20, 100);
    })



    const monsterHealth = 5;

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

    const optIn = (runtime, account, appID) => {
        runtime.executeTx({
            type: types.TransactionType.OptInToApp,
            sign: types.SignType.SecretKey,
            fromAccount: account,
            appID: appID,
            payFlags: { totalFee: 1000 },
        });
    };

    const attack = (runtime, account, appID) => {
        const attackAppArgs = ["Attack"].map(convert.stringToBytes);
        runtime.executeTx({
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccount: account,
            appID: appID,
            payFlags: { totalFee: 1000 },
            appArgs: attackAppArgs,
        });
    };

    const rewardPlayer = (runtime, sender, mvp_address, appID) => {
        const rewardAppArgs = ["Reward"].map(convert.stringToBytes);
        return runtime.executeTx({
            type: types.TransactionType.CallApp,
            sign: types.SignType.SecretKey,
            fromAccount: sender,
            appID: appID,
            payFlags: { totalFee: 1000 },
            appArgs: rewardAppArgs,
            accounts: [mvp_address],
        });
    };



    it("should deploy the game", function () {
        const [gameApp, appID] = initGameContract();
        assert.isDefined(gameApp);
        assert.isNumber(appID);
        const readGlobalState = runtime.getGlobalState(appID,"Creator");
        

        assert.equal(readGlobalState, master.addr);
        assert.equal(runtime.getGlobalState(appID, "Health"), monsterHealth); // integer check
        assert.equal(runtime.getGlobalState(appID, "MaxDamage"), 0);

        const appAccount = runtime.getAccount(gameApp.applicationAccount);
        assert.equal(appAccount.amount, 2e7);


    });

    it("should opt in to the game", function () {
        const [gameApp, appID] = initGameContract();
        optIn(runtime, player.account, appID);
        player = runtime.getAccount(player.address);
        let playerState =  player.getLocalState( appID,"Damage");
        assert.equal(playerState,0);
    });

    it("should attack the game", function () {
        const [gameApp, appID] = initGameContract();
        optIn(runtime, player.account, appID);
        attack(runtime, player.account, appID);
        player = runtime.getAccount(player.address);
        let playerState =  player.getLocalState( appID,"Damage");
        assert.equal(playerState,2);
        assert.equal(runtime.getGlobalState(appID, "MaxDamage"), 2)
        assert.equal(runtime.getGlobalState(appID, "Health"),3);
    })

    it("should reward the player", function () {
        const [gameApp, appID] = initGameContract();
        optIn(runtime, player.account, appID);
        attack(runtime, player.account, appID);
        attack(runtime, player.account, appID);
        attack(runtime, player.account, appID);
        assert.equal(runtime.getGlobalState(appID, "MaxDamage"), 6)
        assert.equal(runtime.getGlobalState(appID, "Health"),0);
        const mvp = algosdk.encodeAddress(Buffer.from(runtime.getGlobalState(appID, "Mvp"), "base64"));
        rewardPlayer(runtime, master.account, mvp, appID);
        player = runtime.getAccount(player.address);
        const playerAlgos = 1e7 - (1000 * 4) + 1e6;
        assert.equal(player.amount, playerAlgos);
    })



});
