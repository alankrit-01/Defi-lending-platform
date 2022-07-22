
import {
  Grid,
  Typography,
  Box,
  Toolbar,
  Button,
  AppBar,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import MarketPlace from "./components/MarketPlace";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RefreshIcon from "@mui/icons-material/Refresh";
import DefiJSON from "./artifacts/contracts/Defi.sol/Defi.json";
import DaiJSON from "./artifacts/contracts/DAI.sol/Dai.json"
var Contract = require("web3-eth-contract");

function App() {
  const address = "0xdC1094B1f37A9c23d9a09caC3cD11AAa1406d2F9"; // smart contract address
  

  const [lender, setLender] = useState({
    lenderDepositAmount: "",
    lenderWithDrawAmount: "",
  });

  const [lenderInfo , setLenderInfo] = useState({
    depositAmount:0,
    accInterestAmount:0
  })

  const [borrowerInfo , setBorrowerInfo] = useState({
    borrowedAmount:0,
    totalRepayAmount:0
  })

  const [borrower, setBorrower] = useState({
    borrowerDaiAmount: 0,
    borrowerCollateral:0
  });

  const [balance, setBalance] = useState({
    smartBalance: null,
    accountBalance: null,
  });

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    isProviderLoaded: false,
  });

  const [account, setAccount] = useState(null);
  

 


  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      Contract.setProvider(provider);
      if (provider) {
        const contract = new Contract(DefiJSON.abi, address);
        const web3 = new Web3(provider);

        setWeb3Api({
          provider,
          web3,
          isProviderLoaded: true,
          contract,
        
        });
      } else {
        console.log("Connect to Metamask!");
        setWeb3Api((api) => ({ ...api, isProviderLoaded: true }));
      }
    };
    loadProvider();
  }, []);

  const { web3, contract } = web3Api;

  useEffect(() => {
    const loadAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3 && loadAccount();
  }, [web3]);

  useEffect(() => {
    const loadBalance = async () => {
      const balance = await web3Api.web3.eth.getBalance(account);
      const sc = await web3Api.web3.eth.getBalance(address);
      setBalance({
        accountBalance: web3Api.web3.utils.fromWei(balance, "ether"),
        smartBalance: web3Api.web3.utils.fromWei(sc, "ether"),
      });
    };
    account && loadBalance();
  }, [account]);



  const withDrawEther = async () => {
        const bn = new web3.utils.BN(lender.lenderWithDrawAmount)

    await contract.methods.withdrawEtherLender(bn).send({ from:account}); //1 Ethers

    // const bn = new web3.utils.isBigNumber(lender.lenderWithDrawAmount)
    // await contract.methods.withdrawEtherLender({amount : bn }).send();
  };
  
  const withDrawEtherAll = async () => {
    const response = await contract.methods.withdrawEtherLenderAll().call().then((res) =>  {
      return res;
    })
    return response;
  };
//  console.log(web3Api)
  const repayLoan = async () => {
    // repay the total Loan
  };

  const takeLoan = async () => {
      //  await contract.methods.takeloan().call()
       const response = await contract.methods.takeloan().call().then((res) =>  {
        return res;
      })
      return response;
  };

  const depositEther = async () => {
    await contract.methods.depositEthersLender().send({value : lender.lenderDepositAmount , from:account});
    window.location.reload();
 };

  const approveDai = async () => {
      // await Dai.approve( address,"10000000000000000000000"); 

    // console.log(borrower.borrowerDaiAmount, "approve")
    // here he will approve collateral.
  };

  const depositCollateral = async () => {
      //  await defi.connect(newAccount).DepositCollateral("10000000000000000000000"); 
      await contract.methods.DepositCollateral(borrower.borrowerCollateral).send({ from:account})
      window.reload();
    // console.log(Dai,"ninad")
      // deposit collateral
      // console.log(borrower.borrowerCollateral,"Deposit collateral")
  }

  const updateBorrowed = async () => {  // returns how much borrower has loan he has taken
      //  console.log(await defi.depositorInfo(myAccount.address));
      const info = await contract.methods.depositorInfo(account).call()
      setBorrowerInfo(api => ({...api, borrowedAmount:info.loanInEth}));
  }

  const updateTotal = async () => {    // returns how much borrower has to pay interest + borrowed
      //  console.log(await defi.viewPendingInterestBorrower(myAccount.address));
    //  const value = await contract.methods.depositorInfo(account).call();
    //  console.log(value);
    //  setBorrowerInfo(api => ({...api, totalRepayAmount:value}))
  }

  const viewPendingInterest = async () => {   // returns how much interest lender will be getting.
    const accInterestAmount = await contract.methods.viewPendingInterestLender(account).call();
  
    setLenderInfo((api) => ({...api,accInterestAmount}))
  }
 
  const updateDepositLender = async () => {   // returns how much lender has deposited
    const lenderInfo = await contract.methods.lenderInfo(account).call()
    setLenderInfo(api => ({...api,depositAmount:lenderInfo.amount}))
  }



  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontFamily: "'Lato', sans-serif" }}
            >
              Lending Defi
            </Typography>
            {account ? (
              <h1>Welcome</h1>
            ) : (
              <Button
                onClick={() => {
                  web3Api.provider.request({ method: "eth_requestAccounts" });
                  window.location.reload();
                }}
                color="inherit"
                sx={{ fontFamily: "'Lato', sans-serif" }}
              >
                Connect
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Grid container spacing={3} sx={{ marginTop: "2px" }}>
        <Grid item xs={12} md={8}>
          <MarketPlace sc={balance.smartBalance} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              marginRight: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "130px",
              position: "relative",
            }}
          >
            <Box
              sx={{ padding: "10px", display: "flex", flexDirection: "column" }}
            >
              <div>
                {" "}
                <Typography
                  align="center"
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Your Account
                </Typography>
              </div>
              <div>
                {" "}
                <Typography
                  align="center"
                  gutterBottom
                  sx={{
                    color: "white",
                    marginTop: "5px",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  variant="h5"
                >
                  My Balance : {balance.accountBalance}
                </Typography>
                <Typography
                  align="center"
                  sx={{
                    color: "white",
                    position: "absolute",
                    bottom: "0px",
                    fontFamily: "'Lato', sans-serif",
                  }}
                  variant="p"
                >
                  XYZ network
                </Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid
          xs={12}
          md={12}
          sx={{
            marginTop: "3%",
            fontFamily: "'Heebo', sans-serif",
            fontWeight: "600",
            color: "#757ce8",
          }}
        >
          <Typography align="center" variant="h4">
            Summary
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              margin: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "350px",
              position: "relative",
            }}
          >
            <Box
              sx={{ padding: "10px", display: "flex", flexDirection: "column" }}
            >
              <div>
                {" "}
                <Typography
                  align="center"
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Your Holding
                </Typography>
              </div>
              <div>
              <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Desposit-Amount : {lenderInfo.depositAmount} WEI
                  <IconButton
                    sx={{ cursor: "pointer" }}
                    onClick={updateDepositLender}
                  > <RefreshIcon />
                  </IconButton>
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  View Interest Earned : {lenderInfo.accInterestAmount} WEI
                  <IconButton
                    sx={{ cursor: "pointer" }}
                    onClick={viewPendingInterest}
                  > <RefreshIcon />
                  </IconButton>
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Total Amount: 100
                </Typography>
              </div>
              <Box
                sx={{
                  display: "flex",
                  marginTop: "2%",
                  justifyContent: "column",
                }}
              >
                <Box>
                  <TextField
                    value={lender.lenderDepositAmount}
                    sx={{ color: "white !important" }}
                    type="number"
                    onChange={(e) =>
                      setLender((api) => ({
                        ...api,
                        lenderDepositAmount: e.target.value,
                      }))
                    }
                    label="Add Funds"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    startIcon={<ArrowUpwardIcon />}
                    sx={{ color: "white", marginTop: "4%" }}
                    onClick={depositEther}
                  >
                    Add Funds
                  </Button>
                </Box>
                <Box>
                  <TextField
                    onChange={(e) =>
                      setLender((api) => ({
                        ...api,
                        lenderWithDrawAmount: e.target.value,
                      }))
                    }
                    sx={{ color: "white" }}
                    type="number"
                    label="Withdraw Funds"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    startIcon={<ArrowDownwardIcon />}
                    sx={{ color: "white", marginLeft: "2%", marginTop: "4%" }}
                    onClick={withDrawEther}
                  >
                    Withdraw
                  </Button>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  startIcon={<ArrowDownwardIcon />}
                  sx={{ color: "white", marginLeft: "2%", marginTop: "4%" }}
                  onClick={withDrawEtherAll}
                >
                  Withdraw All Ethers
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              margin: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "350px",
              position: "relative",
            }}
          >
            <Box
              sx={{ padding: "10px", display: "flex", flexDirection: "column" }}
            >
              <div>
                {" "}
                <Typography
                  align="center"
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Borrowed Holding
                </Typography>
              </div>
              <div>
                {/* <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Borrowed Amount: 100
                </Typography> */}
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Borrowed Amount : {borrowerInfo.borrowedAmount} WEI
                  <IconButton
                    sx={{ cursor: "pointer" }}
                    onClick={updateBorrowed}
                  > <RefreshIcon />
                  </IconButton>
                </Typography>
              </div>
              <div>
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Interest Amount: 100
                  <IconButton
                    sx={{ cursor: "pointer" }}
                    onClick={() => console.log("Refresh")}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Typography>
              </div>
              <div>
              <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Total Repay Amount : {borrowerInfo.totalRepayAmount} WEI
                  <IconButton
                    sx={{ cursor: "pointer" }}
                    onClick={updateTotal}
                  > <RefreshIcon />
                  </IconButton>
                </Typography>
              </div>
              <Box
                sx={{
                  display: "flex",
                  marginTop: "2%",
                  justifyContent: "column",
                }}
              >
                <Box>
                  <TextField
                    value={borrowerInfo.totalRepayAmount}
                    sx={{ color: "white !important" }}
                    type="number"
                    label="Repay Loan"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    startIcon={<ArrowUpwardIcon />}
                    sx={{ color: "white", marginTop: "4%" }}
                    onClick={repayLoan}
                  >
                    Repay
                  </Button>
                </Box>
                <Box>
                  <TextField
                    onChange={(e) =>
                      setBorrower((api) => ({
                        ...api,
                        borrowerDaiAmount: e.target.value,
                      }))
                    }
                    sx={{ color: "white" }}
                    type="number"
                    label="Approve Dai"
                    variant="outlined"
                    value={borrower.borrowerDaiAmount}
                  />
                  <Button
                    variant="contained"
                    startIcon={<ArrowUpwardIcon />}
                    sx={{ color: "white", marginLeft: "2%", marginTop: "4%" }}
                    onClick={approveDai}
                  >
                    Approve Dai
                  </Button>
                </Box>
                <Box>
                  <TextField
                    onChange={(e) =>
                      setBorrower((api) => ({
                        ...api,
                        borrowerCollateral: e.target.value,
                      }))
                    }
                    sx={{ color: "white" }}
                    type="number"
                    label="Deposit Collateral"
                    variant="outlined"
                    value={borrower.borrowerCollateral}
                  />
                  <Button
                    variant="contained"
                    startIcon={<ArrowUpwardIcon />}
                    sx={{ color: "white", marginLeft: "2%", marginTop: "4%" }}
                    onClick={depositCollateral}
                  >
                    Deposit Collateral
                  </Button>
                </Box>
              </Box>
              <Button
                    variant="contained"
                    startIcon={<ArrowDownwardIcon />}
                    sx={{ color: "white", marginLeft: "2%", marginTop: "4%" }}
                    onClick={takeLoan}
                  >
                    Take Loan
                  </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
