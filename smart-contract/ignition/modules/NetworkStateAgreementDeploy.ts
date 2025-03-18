import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NetworkStateAgreement", (m) => {
  const constitutionURL = m.contract("NetworkStateAgreement", ["https://ipfs.io/ipfs/xxx"]);

  m.call(constitutionURL, "say", []);

  return { constitutionURL };
});
