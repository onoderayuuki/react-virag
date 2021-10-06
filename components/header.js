// import style from "../styles/header.module.css";
// import Link from 'next/link'
import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from '@material-ui/icons/Menu';

export default function header({children}) {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
        >
        <Link href={"/"} passHref>
            <HomeRoundedIcon  fontSize="large" />
          </Link>
        </IconButton>
        
        {/* <Link href={"/dbtest"}>TEST</Link> */}
        <div className={{flexGrow:1}} />
        {children}
        {/* <Button color="inherit">
          <Link href={"/login"}>Login</Link>
        </Button> */}
      </Toolbar>
    </AppBar>
  );
}
