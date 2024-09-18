const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("MyContractModule", (m) => {

  const PlonkVerifier = m.contract("PlonkVerifier");

  return { PlonkVerifier };
});
