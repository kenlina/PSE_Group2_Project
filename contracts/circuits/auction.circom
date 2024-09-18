pragma circom 2.0.0;

include "../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../node_modules/circomlib/circuits/poseidon.circom";

template proof() {
    signal input random;
    signal input bid;
    signal input reserve;
    signal input commit;
    // signal output out;
    component hash = Poseidon(2);
    component gt = GreaterThan(20);
    hash.inputs[0] <== bid;
    hash.inputs[1] <== random;
    // out <== hash.out;
    hash.out === commit ;
    gt.in[0] <== bid;
    gt.in[1] <== reserve;
    gt.out === 1;
}

component main { public [commit, reserve] } = proof();