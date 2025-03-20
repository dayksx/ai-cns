import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import { verify } from "../scripts/VerifyContract";
import type { NetworkStateInitiatives } from "../src/types/NetworkStateInitiatives";
import type { NetworkStateInitiatives__factory } from "../src/types/factories/NetworkStateInitiatives__factory";

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const [deployer, acc] = await ethers.getSigners();
  await deployNetworkStateInitiatives(acc, true, true);
}

export async function deployNetworkStateInitiatives(
  deployer: SignerWithAddress,
  verifyContract: boolean,
  filldata: boolean,
): Promise<string> {
  console.log("Deployer:", deployer.address);
  const factory = (await ethers.getContractFactory("NetworkStateInitiatives")) as NetworkStateInitiatives__factory;
  const contract = (await factory.connect(deployer).deploy()) as NetworkStateInitiatives;
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("NetworkStateInitiatives deployed to:", address);

  if (filldata) {
    await fillData(contract);
  }

  if (verifyContract) {
    setTimeout(async () => {
      await verify(address);
    }, 5000);
  }

  return address;
}

async function fillData(contract: NetworkStateInitiatives) {
  const [acc1, acc2, acc3] = await ethers.getSigners();
  const tags = ["identity", "privacy", "zero-knowledge proof", "decentralization"];
  await contract
    .connect(acc1)
    .createInitiatives(
      acc1.address,
      "Cryptographical Passport with zkproof",
      "A decentralized identity verification system that utilizes zero-knowledge proofs to allow CNS netizens to prove their identity or certain attributes without revealing sensitive information. This digital passport empowers users to interact securely across decentralized platforms while protecting their personal data.",
      "Decentralized Identity Systems",
      tags,
    );

  const tags2 = ["dispute resolution", "decentralization", "community governance"];
  await contract
    .connect(acc2)
    .createInitiatives(
      acc2.address,
      "Decentralized Dispute Resolution System",
      "A system where disputes are resolved through a network of autonomous agents and community-driven protocols utilizing blockchain technology to ensure transparency and fairness. Smart contracts will automate resolutions based on predefined community guidelines integrating decentralized identity verification and leveraging reputation systems to provide a secure and equitable process.",
      "Governance",
      tags2,
    );

  const tags3 = ["crowfunding", "decentralization"];
  await contract
    .connect(acc3)
    .createInitiatives(
      acc3.address,
      "Decentralized crodwfunding platform",
      "A system where crowfunding is accessible by everyone while relaying on web3 technologies.",
      "crowfunding",
      tags3,
    );

  await contract
    .connect(acc1)
    .createInitiatives(
      acc1.address,
      "Self-Sovereign Data Market",
      "A decentralized data marketplace where individuals can sell or share their personal data with full control over access and monetization. Utilizing blockchain-based consent mechanisms and encrypted storage, users ensure privacy and data sovereignty.",
      "Data Privacy",
      ["data sovereignty", "decentralization", "privacy"],
    );

  await contract
    .connect(acc2)
    .createInitiatives(
      acc2.address,
      "Decentralized Social Media Protocol",
      "A censorship-resistant, user-owned social media network that rewards content creators through tokenized incentives while ensuring free speech and resistance to central authority control.",
      "Social Media & Communication",
      ["social media", "decentralization", "free speech"],
    );

  await contract
    .connect(acc3)
    .createInitiatives(
      acc3.address,
      "Decentralized Autonomous City",
      "An experiment in urban governance using blockchain-based decision-making, allowing residents to participate in direct governance, public budgeting, and city planning through quadratic voting and smart contracts.",
      "Urban Governance",
      ["decentralization", "governance", "quadratic voting"],
    );

  await contract
    .connect(acc1)
    .createInitiatives(
      acc1.address,
      "Web3-Based Decentralized Education Platform",
      "A blockchain-powered education system where learners earn verifiable credentials stored on-chain. Educators and students engage in a trustless environment where content curation is democratized and incentivized.",
      "Education & Learning",
      ["education", "decentralization", "blockchain"],
    );

  await contract
    .connect(acc2)
    .createInitiatives(
      acc2.address,
      "Decentralized AI Governance",
      "A framework for governing AI models in a decentralized way, allowing communities to propose, vote, and regulate AI behavior and decision-making through on-chain governance mechanisms.",
      "AI & Governance",
      ["AI governance", "decentralization", "autonomous systems"],
    );

  await contract
    .connect(acc3)
    .createInitiatives(
      acc3.address,
      "Peer-to-Peer Renewable Energy Grid",
      "A decentralized energy trading platform where individuals can produce, trade, and consume renewable energy using blockchain-based smart contracts for transparent and automated transactions.",
      "Sustainability & Energy",
      ["energy", "decentralization", "sustainability"],
    );
}
