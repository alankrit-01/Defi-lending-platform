import { Paper, Box, Typography, Grid } from '@mui/material'
import React from 'react'

const MarketPlace = () => {
    const XYZ = 69
  return (
    <Paper  elevation={3}  sx={{  marginLeft:"2%", backgroundColor:"#757ce8" , justifyItems:"center" , height:"130px"}}>
    <Box  sx={{ padding:"10px" , display:"flex" , flexDirection:"column" ,  }}>
    <div> <Typography align='center'  sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Interest rates</Typography></div>
    <Grid container spacing={2}>
     <Grid item md={4}>
     <div> <Typography align='center'  sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Market Size</Typography></div>
     <div> <Typography align='center' gutterBottom  sx={{ color:"white" , marginTop:"5px" , fontFamily:"'Lato', sans-serif" }} variant='h5'>{XYZ}%</Typography></div>
     </Grid>
     <Grid item md={4}>
     <div> <Typography align='center'  sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Deposit APY</Typography></div>
      <div> <Typography align='center' gutterBottom  sx={{ color:"white" , marginTop:"5px" , fontFamily:"'Lato', sans-serif" }} variant='h5'>{XYZ}%</Typography></div>
     </Grid>
     <Grid item md={4}>
     <div> <Typography align='center'  sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Borrow APY</Typography></div>
      <div> <Typography align='center' gutterBottom  sx={{ color:"white" , marginTop:"5px" , fontFamily:"'Lato', sans-serif" }} variant='h5'>{XYZ}%</Typography></div>
     </Grid>
    </Grid>
    </Box>
</Paper>
  )
}

export default MarketPlace