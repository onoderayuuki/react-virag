import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function toolbar({ children }) {
  const classes = makeStyles((theme) => ({
    tool: {
      position:'absolute',
      top: "auto",
      bottom: 0,
      backgroundColor:"#F6F3EC"
    },
  }));
    return (
      // <AppBar position="static" >
        <Toolbar style={{color:"#660000" ,display:"flex",justifyContent: 'space-between'}}>
          {children}
        </Toolbar>
      // </AppBar>
    );    
  }