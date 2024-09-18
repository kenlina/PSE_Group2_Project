const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("MyContractModule", (m) => {

  const MyContract = m.contract("MyContract");

  return { MyContract };
});
