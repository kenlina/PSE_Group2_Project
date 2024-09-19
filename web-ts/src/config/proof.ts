// prettier-ignore
export type Proof = {
  proof: [ // Plonk proof for on-chain submission Have 24 elements inside
    string, string, string, string, string,
    string, string, string, string, string,
    string, string, string, string, string,
    string, string, string, string, string,
    string, string, string, string,
  ];
  publicSignals: Array<string>;
};

export const proofArtifacts = {
    wasm: "/circuit_artifact/auction.wasm",
    zkey: "/circuit_artifact/auction_final.zkey",
};