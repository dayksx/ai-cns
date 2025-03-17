import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NetworkStateAgreement", (m) => {
  const constitutionHash = m.contract("NetworkStateAgreement", ["IPFS hash"]);

  m.call(constitutionHash, "say", []);

  return { constitutionHash };
});
