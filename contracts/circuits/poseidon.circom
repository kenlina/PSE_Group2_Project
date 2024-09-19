pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/comparators.circom";
include "../node_modules/circomlib/circuits/poseidon.circom";

template poseidon() {
    signal input bid;
    signal input random;
    signal output hashValue;
    // signal output out;
    component hash = Poseidon(2);
    hash.inputs[0] <== bid;
    hash.inputs[1] <== random;
    hashValue <== hash.out;
}

component main = poseidon();