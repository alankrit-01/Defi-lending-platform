import React from 'react'
import { Box, Paper, Typography  ,Button } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Lend = () => {
  return (
    <Paper  elevation={3}  sx={{  marginLeft:"2%", backgroundColor:"#757ce8" , justifyItems:"center" ,  height:"200px" , position:"relative"}}>
    <Box  sx={{ padding:"10px" , display:"flex" , flexDirection:"column" ,  }}>
        <div> <Typography align='center'  sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Your Holding</Typography></div>
        <div><Typography sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Deposit Amount: 100</Typography></div>
        <div><Typography sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Interest Earned: 100</Typography></div>
        <div><Typography sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Total Amount: 100</Typography></div>
        <Box sx={{display:'flex' , marginTop:"2%"}}>
        {/* <span><IconButton aria-label="delete" size="small">
         <ArrowUpwardIcon sx={{color:"white"}} fontSize="medium" />Add Funds
       </IconButton></span>
       <span><IconButton aria-label="delete" size="small">
         <ArrowDownwardIcon  sx={{color:"white"}} fontSize="medium" />Withdraw
       </IconButton></span> */}
       <Button variant="contained" startIcon={<ArrowUpwardIcon />}  sx={{color:"white"}} >
       Add Funds
       </Button>
       <Button variant="contained"  startIcon={<ArrowDownwardIcon />}  sx={{color:"white" , marginLeft:"2%"}} >
      Withdraw
       </Button>
        </Box>
   
       

    </Box>
</Paper>
  )
}

export default Lend