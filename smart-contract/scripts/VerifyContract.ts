import hre from "hardhat";

async function verify(contractAddress: string): Promise<void> {
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
    });
  } catch (err: unknown) {
    // Any failed verifications should not block further step
    console.log(err);
  }
}
export { verify };
