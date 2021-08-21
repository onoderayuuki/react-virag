// import style from "../styles/header.module.css";
// import Link from 'next/link'
import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from '@material-ui/icons/Menu';


export default function header({children}) {
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
  }));
  return (
    <AppBar position="static" color="secondary">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <Link href={"/"}>
            <HomeRoundedIcon  fontSize="large" />
          </Link>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Virag
        </Typography>
        {/* <Link href={"/dbtest"}>TEST</Link> */}
        {children}
        <Button color="inherit">
          <Link href={"/login"}>Login</Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}