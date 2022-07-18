
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

  const [borrower, setBorrower] = useState({
    borrowerRepayAmount: "",
    borrowerLoanAmount: "",
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
        var contract = new Contract(DefiJSON.abi, address);
        setWeb3Api({
          provider,
          web3: new Web3(provider),
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

  const depositEther = async () => {
     await contract.methods.depositEthersLender().send({value : lender.lenderDepositAmount , from:account});
     window.location.reload();
  };

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

  const repayLoan = async () => {
    console.log("Repay Loan!");
  };

  const takeLoan = async () => {
    console.log(borrower.borrowerLoanAmount);
  };

  const viewPendingInterest = async () => {
    const accInterestAmount = await contract.methods.viewPendingInterestLender(account).call();
    setLenderInfo((api) => ({...api,accInterestAmount}))
  }
 
  const updateDepositLender = async () => {
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
              marginLeft: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "330px",
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
              marginLeft: "2%",
              backgroundColor: "#757ce8",
              justifyItems: "center",
              height: "300px",
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
                <Typography
                  sx={{ color: "white", fontFamily: "'Lato', sans-serif" }}
                  variant="h6"
                >
                  Borrowed Amount: 100
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
                    value={borrower.borrowerRepayAmount}
                    sx={{ color: "white !important" }}
                    type="number"
                    label="Repay Funds"
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
                        borrowerLoanAmount: e.target.value,
                      }))
                    }
                    sx={{ color: "white" }}
                    type="number"
                    label="Borrow Funds"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    startIcon={<ArrowDownwardIcon />}
                    sx={{ color: "white", marginLeft: "2%", marginTop: "4%" }}
                    onClick={takeLoan}
                  >
                    Borrow
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
