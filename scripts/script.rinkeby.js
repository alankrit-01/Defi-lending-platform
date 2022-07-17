const {ethers,waffle} = require("hardhat");
const hre = require("hardhat");


async function main() {
  const [myAccount] =await ethers.getSigners();
  const provider = waffle.provider;

  // const Defi = await ethers.getContractFactory("Defi");
  // const defi = await Defi.deploy({value:"1000"});
  // await defi.deployed();
  // console.log("Defi deployed to:", defi.address);

  const defi = await ethers.getContractAt("Defi","0xdC1094B1f37A9c23d9a09caC3cD11AAa1406d2F9");
  const Dai = await ethers.getContractAt("Dai","0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa");

  // console.log(await provider.getBalance(myAccount.address));
  // console.log(await provider.getBalance(defi.address));
  // console.log(await Dai.balanceOf(myAccount.address));  // 585097 007794 9377202721505
  // await Dai.transfer(defi.address, "1077949377202721505");  // 585097 0077949377202721505
  // console.log(await Dai.balanceOf(defi.address));  // 585097 007794 9377202721505

  //----------------- LENDING FUNCTIONS ---------------

  // STEP I LENDER DEPOSIT SOME ETHERS

      //  await defi.depositEthersLender({value :"200000000"}) 
      // console.log((await defi.lenderInfo(myAccount.address)).amount.toString())
      

//   // STEP II LENDER CAN WITHDRAW PARTIALLY

//   await defi.withdrawEtherLender("100") //1 Ethers
//   console.log((await defi.lenderInfo(myAccount.address))) 
  
//  // STEP III ANYONE CAN VIEW THE PENDING INTEREST FOR A LENDER

//   console.log(await defi.viewPendingInterestLender(myAccount.address))
  
//   // // STEP IV  LENDER CAN WITHDRAW ALL ETHERS
  
//   await defi.withdrawEtherLenderAll() 
//   console.log((await defi.lenderInfo(myAccount.address))) 

  // ------------------BOROWING FUNCTIONS ---------------

// STEP I BORROWER CAN BORROW ETHER BY SENDING DAI AS COLLATERAL 

  // await Dai.approve( defi.address,"9377202721505");
  // console.log(await Dai.allowance( myAccount.address,defi.address));

   // STEP II BORROWER CALL DEPOSIT COLLATERAL
 
  //  await defi.DepositCollateral("9377202721505");
  //  console.log(await defi.depositorInfo(myAccount.address));
  //  console.log(await Dai.balanceOf(defi.address));

//    // STEP III BORROWER CAN NOT TAKE OUT LOAN (60% OF HIS COLLATERAL)
 
  //  await defi.takeloan();
  // console.log(await Dai.balanceOf(defi.address));
  //  console.log(await defi.depositorInfo(myAccount.address));
//    // STEP IV  BORROWER CAN VIEW HOW MUCH LOAN + INTEREST HE HAS TO PAY BACK
   
  //  console.log(await defi.depositorInfo(myAccount.address));
  //  console.log(await defi.getBlockNum());
  //  console.log(await defi.viewPendingInterestBorrower(myAccount.address));

//    // STEP IV  BORROWER WILL REPAY LOAN +INTEREST
   
  //  await defi.repayLoan({value:"82960"});




  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
