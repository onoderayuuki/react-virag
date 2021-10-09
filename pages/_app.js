import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { auth, db } from "../components/firebase";
import { useState, createContext,useEffect } from "react";

import  Loading from './loading.js' 

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
  const getCurrentDate = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date}`;
  };
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      // 未ログイン時
      if (!user) {
        auth
          .signInAnonymously()
          .then(() => {
            console.log("nouser!->anonymously");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      }
      // ログイン時
      else {
        console.log("Login as ", user.uid);
        //ここで登録済みかどうかを確認
        const firebaseData = db
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            setUserID(user.uid);
            //初回登録処理
            if (doc.exists) {
              console.log("登録済みのユーザー:", user.uid, doc.data());
            } else {
              db.collection("users")
                .doc(user.uid)
                .set({
                  name: "none",
                  created_at: getCurrentDate("/"),
                })
                //TODO：Collectionのdesignとmotif,seriesも追加
                .then(() => {
                  console.log("新規登録しました", user.uid);
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                });
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      }
    });
  },[]);
  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={userID}>
        {!userID&&<Loading />}
        {userID&&<Component {...pageProps} />}
      </UserContext.Provider>
    </ThemeProvider>
  );
}
