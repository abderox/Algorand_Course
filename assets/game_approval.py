from pyteal import *

def game():
    
    monsterHealth = Btoi(Txn.application_args[0])
    handle_creation = Seq([
        Assert(monsterHealth >= Int(5)),
        App.globalPut(Bytes("Creator"), Txn.sender()),
        App.globalPut(Bytes("Health"), monsterHealth),
        App.globalPut(Bytes("MaxDamage"), Int(0)),
        Return(Int(1))
    ])

    '''
    Initialize player's damage dealt to the monster
    '''
    handle_optin = Seq([
        Assert(App.optedIn(Txn.sender(), Txn.application_id())),
        App.localPut(Txn.sender(), Bytes("Damage"), Int(0)),
        Return(Int(1))
    ])

    '''
    Attacks the monster
    '''
    currentMonsterHealth = App.globalGet(Bytes("Health"))
    playerDamage = Int(2) # deal 2 damage
    playerCurrentDamage = App.localGet(Txn.sender(), Bytes("Damage")) # returns 0 if state is not found
    playerTotalDamage = playerCurrentDamage + playerDamage
    currentMvpDamage = App.globalGet(Bytes("MaxDamage")) # highest amount of damage dealt to monster    
    
    update_player_total_damage = Seq([
        App.localPut(Txn.sender(), Bytes("Damage"), playerTotalDamage),
    ])

    update_monster_health = If(
        playerDamage > currentMonsterHealth, 
        App.globalPut(Bytes("Health"), Int(0)), # monster is dead
        App.globalPut(Bytes("Health"), currentMonsterHealth - playerDamage) # reduce monster health
    )

    update_mvp = If(
        playerTotalDamage > currentMvpDamage,
        Seq([
            App.globalPut(Bytes("Mvp"), Txn.sender()),
            App.globalPut(Bytes("MaxDamage"), playerTotalDamage)
        ])
    )

    attack_monster = Seq([
        Assert(currentMonsterHealth > Int(0)),
        update_mvp,
        update_player_total_damage,
        update_monster_health,
        Return(Int(1))
    ])

    '''
    Reward player
    '''
    mvp = App.globalGet(Bytes("Mvp"))
    reward_player = Seq([
        Assert(Txn.sender() == Global.creator_address()),
        Assert(currentMonsterHealth <= Int(0)),
        Assert(Txn.accounts[1] == mvp),
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver: Txn.accounts[1],
            TxnField.amount: Int(1000000),
        }),
        InnerTxnBuilder.Submit(),
        Return(Int(1))
    ])

    # # Write your code here
    # max_health = Btoi(Txn.application_args[0])
    # handle_creation = Seq(
    #     [
    #         App.globalPut(Bytes("Creator"), Txn.sender()),
    #         Assert(max_health>= Int(5)),
    #         App.globalPut(Bytes("Health"), max_health),
    #         App.globalPut(Bytes("GDamage"), Int(0)),
    #         Return(Int(1)),
    #     ]
    # )
    
    is_creator = Txn.sender() == App.globalGet(Bytes("Creator"))
    
    # handle_optin = Seq([
    #     App.localPut(Txn.sender(), Bytes("Damage"), Int(0)),
    #     Return(Int(1)),
    # ])
    
    
    # attackTheMonster = App.globalGet(Bytes("Health"))
    # playerDamage = Int(2)
    # maxDamages = App.globalGet(Bytes("GDamage"))
    # currentDamage = App.localGet(Txn.sender(), Bytes("Damage"))
    # totalDamages = currentDamage + playerDamage
    
    # update_player_total_damage = Seq([
    #     App.localPut(Txn.sender(),Bytes("GDamage"), totalDamages),
    # ])
    
    # update_monster_health = If(
    #     playerDamage > attackTheMonster,
    #     App.globalPut(Bytes("Health"), Int(0)),
    #     App.globalPut(Bytes("Health"), attackTheMonster - playerDamage),
    # )
    
    
    # update_max_damage = If(
    #     totalDamages > maxDamages,
    #     Seq([
    #         App.globalPut(Bytes("bestAttacker"), Txn.sender()),
    #         App.globalPut(Bytes("GDamage"), totalDamages),
    #     ])
        
    # )
    
    
    # attack_monster = Seq([
    #     Assert(attackTheMonster > Int(0)),
    #     If(
    #         is_creator,
    #         handle_creation,
    #         If(
    #             App.optedIn(Txn.sender(),Txn.application_id()),
    #             handle_optin,
    #             Return(Int(0))
    #         )
    #     ),
    #     update_max_damage,
    #     update_player_total_damage,
    #     update_monster_health,
    #     Return(Int(1))
    # ])
    
    
    # highestDamagePlayer = App.globalGet(Bytes("bestAttacker"))
    # reward_player = If(
    #     Txn.accounts[1] == highestDamagePlayer,
    #     Seq([
    #         InnerTxnBuilder.Begin(),
    #         InnerTxnBuilder.SetFields(
    #             {
    #                 TxnField.type_enum : TxnType.Payment,
    #                 TxnField.amount : Int(1000000),
    #                 TxnField.receiver : Txn.accounts[1],
    #             }
    #         ),
    #         InnerTxnBuilder.Submit(),
    #         Return(Int(1))
    #     ])
    # )
        
   
    
    
    
    handle_noop = Seq(
        Assert(Global.group_size() == Int(1)),
        Cond(
            [Txn.application_args[0] == Bytes("Attack"),attack_monster],
            [Txn.application_args[0] == Bytes("Reward"),reward_player]
        )
    )
    
    handle_closeout = Return(Int(1))
    handle_updateapp = Return(is_creator)
    handle_deleteapp = Return(is_creator)

    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )

    return program

if __name__ == "__main__":
    print(compileTeal(game(), mode=Mode.Application, version=6))