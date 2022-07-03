const {ethers} = require("hardhat");
async function main() {
//   const [account] =await ethers.getSigners();

  const Defi =await ethers.getContractFactory("Defi");
  const defi =Defi.attach("0xB53181D3069758dbE613e046E19BD2bd83a93b9C");

  await defi.withdrawEtherLenderAll();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
