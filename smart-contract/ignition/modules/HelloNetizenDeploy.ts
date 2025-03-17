import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("HelloNetizen", (m) => {
  const hello = m.contract("HelloNetizen", ["hello Netizen !!"]);

  m.call(hello, "say", []);

  return { hello };
});
