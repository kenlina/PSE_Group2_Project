const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AuctionModule", (m) => {
  // Ensure both contracts are deployed before deploying Auction
  const Poseidon = m.contract("Poseidon");
  const PlonkVerifier = m.contract("PlonkVerifier");
  const Auction = m.contract("Auction", [
        Poseidon,
        PlonkVerifier,
    ]
  );

  return { Auction };
});
