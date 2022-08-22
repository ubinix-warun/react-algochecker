#samplecontract.py
from pyteal import *

"""Basic Counter Application"""

def approval_program():
    program = Return(Int(1))
    return program

def clear_state_program():
    program = Return(Int(1))
    return program
    

if __name__ == "__main__":
    with open("ss_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=5)
        f.write(compiled)

    with open("ss_clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=5)
        f.write(compiled)