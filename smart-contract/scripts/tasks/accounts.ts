import { task } from "hardhat/config";

task("accounts", "Prints the accounts list", async (_taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});
