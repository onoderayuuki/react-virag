import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from "@material-ui/core/Box";


const useStyles = makeStyles((theme)=>({
  root: {
    flexGrow: 1,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
    fontSize: '8px',
    color:'white',
    width:'100%',
    // backgroundColor:theme.palette.background.paper
  }
}));

export default function footer({ children }) {
  const classes = useStyles();
    return (
      <Box position="fixed" className={classes.appBar}>
        <Toolbar position="fixed" className={classes.appBar} variant="dense"style={{justifyContent:'center'}}>
          {children}
        </Toolbar>
       </Box>
    );    
  }