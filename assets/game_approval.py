from pyteal import *

def game():
    # Write your code here
    handle_creation = Return(Int(1))
    handle_optin = Return (Int(1))
    handle_noop = Return(Int(1))
    handle_closeout = Return(Int(1))
    handle_updateapp = Return(Int(0))
    handle_deleteapp = Return(Int(1))

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