const {ethers, waffle} = require("hardhat");
async function main() {
  const [account] =await ethers.getSigners();
  const provider = waffle.provider;
  
  const Defi =await ethers.getContractFactory("Defi");
  const defi =Defi.attach("0x2a55141679f6B5DB1Ba80d0e3ef5Ef74E4c54D9c");
  console.log(await defi.totalBalance());
  console.log(await defi.getBlockNum());
  console.log(await defi.lenderInfo(account.address));

  await defi.withdrawEtherLenderAll();
  console.log(await defi.totalBalance());
  console.log(await defi.getBlockNum());
  console.log(await provider.getBalance(account.address))
  console.log(await defi.lenderInfo(account.address));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
