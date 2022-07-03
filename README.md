# Defi-lending-platform

## ABOUT
Defi lending and borrowing platorm where, 
- Lender can deposit ethers
- Lender can withdraw ethers partially (maximum, his principal amount)
- Lender can withdarw all of his ethers (principal + Interest)
- Borrower can send Dai token as collateral can can redeem 60% of it as loan (as ethers)
- Borrower will get his collateral back (as Dai) with he pay his loan amount +interest back (in ethers)
- Lending and borrowing interest rates are fixed per block

## HOW TO RUN 
> npx hardhat node --fork https://speedy-nodes-nyc.moralis.io/3b50a8f528f7397fd9f310cf/eth/mainnet<br>
> npx hardhat run ./scripts/script.js 

## UNCOMPLETE 
- Will code a function to liquidate collateral if borrower is unable to replay loan

