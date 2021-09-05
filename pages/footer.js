import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';


const useStyles = makeStyles({
  appBar: {
    top: 'auto',
    bottom: 0,
    fontSize: '8px'
  }
});

export default function footer({ children }) {
  const classes = useStyles();
    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          {children}
        </Toolbar>
      </AppBar>
    );    
  }