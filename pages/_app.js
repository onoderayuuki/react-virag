import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { auth, db } from "../components/firebase";
import { useState, createContext,useEffect } from "react";

import Auth from './auth.js' 

export const UserContext = createContext();

export const theme = createTheme({
  palette: {
    primary: {
      light: "#F6F3EC",
      main: "#660000",
      contrastText: "#F6F3EC",
    },
    secondary: {
      light: "rgba(102, 0, 0, 0.3)",
      main: "rgba(102, 0, 0, 0.5)",
      contrastText: "#F6F3EC",
    },
  },
});

export default function MyApp({ Component, pageProps }) {
  const [userID, setUserID] = useState("");
  
  useEffect(() => {
    // onAuthStateChanged→何らかのユーザー認証変化があったら実行される
    // その際に[user]内に格納される＝空だったら何も起こらない→つまりログインされていない状態
    const unSub = auth.onAuthStateChanged((user) => {
      console.log("check",user)
      
      // あるときは user = true ,
      // ないときは !user = false
      // !user = falseとなる、つまりユーザーがログインしていない状態の時はログインページに飛ばす
      !user && props.history.push("auth");
    });

    return () => unSub();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={userID}>
        {!userID&&<Auth />}
        {userID&&<Component {...pageProps} />}
      </UserContext.Provider>
    </ThemeProvider>
  );
}
