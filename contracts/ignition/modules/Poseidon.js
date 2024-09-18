const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("MyContractModule", (m) => {

  const Poseidon = m.contract("Poseidon");

  return { Poseidon };
});
