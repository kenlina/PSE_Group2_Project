#! /bin/bash

if [ -z "$1"]; then
    echo "Usage: ./compile.sh [circuit name]"
    exit 1
else
    echo "Start compile ${1}.circom"
    echo "---------------------------------Starting---------------------------------"
    circuit_name=$1
    circom ${circuit_name}.circom --r1cs --wasm --sym
    snarkjs plonk setup ${circuit_name}.r1cs pot12_final.ptau ${circuit_name}_final.zkey   
    snarkjs zkey export verificationkey ${circuit_name}_final.zkey verification_key.json
    snarkjs wtns calculate ${circuit_name}_js/${circuit_name}.wasm input.json witness.wtns
    snarkjs plonk prove ${circuit_name}_final.zkey witness.wtns proof.json public.json
    snarkjs plonk verify verification_key.json public.json proof.json
fi