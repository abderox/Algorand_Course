import sys
sys.path.insert(0,'.')

from algobpy.parse import parse_params
from pyteal import *


def htlc(acc1_addr, acc2_addr, hash, timeout):

    is_payment = Txn.type_enum() == TxnType.Payment
  
    basic_cheks = And(is_payment, Txn.close_remainder_to() == Global.zero_address(),
                      Txn.rekey_to() == Global.zero_address(), Txn.fee() <= Int(1000))

    withrawal_condition = And(
        Txn.receiver() == Addr(acc2_addr),
        Sha256(Arg(0)) == Bytes("base64", hash)
    )

    recovery_condition = And(
        Txn.receiver() == Addr(acc1_addr),
        Txn.first_valid() > Int(timeout)
    )

    return And(basic_cheks, Or(withrawal_condition, recovery_condition))


if __name__ == "__main__":
    # Default receiver address used if params are not supplied when deploying this contract
    params = {
        "acc1": "KWJXTEDS6TAPH2KDJNVDD6WIR5RBXJ3MS352HB72X6U6YH4ZFFBVJE52JI",
        "acc2": "D77LJYBFRZR3HBF6R2IK4Q5TRNXNGG7L5KJZS6TS7GHEPQZ4XC7WXXE5PU",
        "hash": "QzYhq9JlYbn2QdOMrhyxVlNtNjeyvyJc/I8d8VAGfGc=",
        "timeout": 3001
    }

    # Overwrite params if sys.argv[1] is passed
    if (len(sys.argv) > 1):
        params = parse_params(sys.argv[1], params)

    print(compileTeal(htlc(
        params["acc1"],
        params["acc2"],
        params["hash"],
        params["timeout"]), mode=Mode.Signature, version=6))


# ? RSIADYNR4XIX7NZVCMZXKU7T5QNPKEX3WMO6LMC5HDBJEZKWD7APGK5FZU contract address