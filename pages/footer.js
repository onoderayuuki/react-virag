import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

export default function footer({ children }) {
  const classes = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    footer: {
      position:'absolute',
      top: "auto",
      bottom: 0,
    },
  }));
    return (
      <AppBar position="static" >
        <Toolbar variant="dense">
          {children}
        </Toolbar>
      </AppBar>
    );    
  }