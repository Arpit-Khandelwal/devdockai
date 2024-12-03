import { ethers } from 'hardhat';

async function main() {
  const SIPManager = await ethers.getContractFactory('SIPManager');
  const sipManager = await SIPManager.deploy();
  await sipManager.deployed();

  console.log(`SIPManager deployed to ${sipManager.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});