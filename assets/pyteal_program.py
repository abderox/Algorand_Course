# Contract Account

# Add directory to path so that algobpy can be imported
from ast import arg
import sys
sys.path.insert(0,'.')

from algobpy.parse import parse_params
from pyteal import *

def main(RECEIVER_1, RECEIVER_2):

    is_payment = Txn.type_enum() == TxnType.Payment
    is_correct_addr = Or(Txn.receiver()==Addr(RECEIVER_1),Txn.receiver()==Addr(RECEIVER_2))
    basic_cheks = And(Txn.close_remainder_to()==Global.zero_address(),
    Txn.asset_close_to()==Global.zero_address(),
    Txn.rekey_to() == Global.zero_address())
    acceptable_fee = Txn.fee() <= Int(1000)
    chooseWichRcv = Cond([Txn.receiver()==Addr(RECEIVER_1),Arg(0)==Bytes("rcv1password")],
    [Txn.receiver()==Addr(RECEIVER_2),Arg(0)==Bytes("rcv2password")])
    chooseAmount = Cond([Txn.receiver()==Addr(RECEIVER_1),Txn.amount()<= Int(5000000)],
    [Txn.receiver()==Addr(RECEIVER_2),Txn.amount()<= Int(10000000)])
    
    program = Return(And(is_payment,is_correct_addr,basic_cheks,acceptable_fee,chooseWichRcv,chooseAmount))

    return program

if __name__ == "__main__":
    params = {
        "RECEIVER_1": "54TK55AE76UIWFWF2SRTTIWUA5DHQCNLDSXDLNWHS5UMDREVMV2UHDZQKY",
        "RECEIVER_2": "D77LJYBFRZR3HBF6R2IK4Q5TRNXNGG7L5KJZS6TS7GHEPQZ4XC7WXXE5PU",
    }

    # Overwrite params if sys.argv[1] is passed
    if(len(sys.argv) > 1):
        params = parse_params(sys.argv[1], params)

    print(compileTeal(main(params["RECEIVER_1"], params["RECEIVER_2"]), Mode.Signature, version=6))
