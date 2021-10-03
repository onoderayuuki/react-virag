import Toolbar from '@material-ui/core/Toolbar';
import Box from "@material-ui/core/Box";

export default function footer({ children }) {
  const appBar = {
    top: 'auto',
    bottom: 0,
    fontSize: '8px',
    color:'white',
    width:'100%',
    // backgroundColor:theme.palette.background.paper
  };
    return (
      <Box position="fixed" style={appBar}>
        <Toolbar position="fixed" variant="dense"style={{justifyContent:'center'}}>
          {children}
        </Toolbar>
       </Box>
    );    
  }