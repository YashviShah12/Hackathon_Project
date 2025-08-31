const hre = require("hardhat");

async function main() {
  const GreenHydrogenCredit = await hre.ethers.getContractFactory("GreenHydrogenCredit");
  const ghc = await GreenHydrogenCredit.deploy();
  await ghc.waitForDeployment();
  console.log("GreenHydrogenCredit deployed to:", await ghc.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });