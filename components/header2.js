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

export default function header2({children}) {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar variant="dense">
        
        {children}
      </Toolbar>
    </AppBar>
  );
}
