import { Box, Paper, Typography } from '@mui/material'
import React from 'react'

const AccountDetails = () => {
  const XYZ = "25 eth"
  return (
    <Paper  elevation={3}  sx={{  marginRight:"2%", backgroundColor:"#757ce8" , justifyItems:"center" ,  height:"130px" , position:"relative"}}>
        <Box  sx={{ padding:"10px" , display:"flex" , flexDirection:"column" ,  }}>
            <div> <Typography align='center'  sx={{ color:"white" , fontFamily:"'Lato', sans-serif" }} variant='h6'>Your Account</Typography></div>
            <div> <Typography align='center' gutterBottom  sx={{ color:"white" , marginTop:"5px" , fontFamily:"'Lato', sans-serif" }} variant='h5'>My Balance : {XYZ}</Typography>
             <Typography align='center' sx={{ color:"white" , position:"absolute" , bottom:"0px", fontFamily:"'Lato', sans-serif" }} variant='p'>XYZ network</Typography>

            {/* <Typography sx={{ color:"white"}} variant='h4'> {XYZ}</Typography> */}
            </div>
        </Box>
    </Paper>
  )
}

export default AccountDetails