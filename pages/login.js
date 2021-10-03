import { Grid, Paper, Avatar, TextField,FormControlLabel,Checkbox,Button,Typography,Link } from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";

// import { EmailAuthProvider,getAuth, linkWithCredential } from "firebase/auth";
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { auth } from "../components/firebase";

import Header from "../components/header.js";

export default function Login(props) {
  const paperStyle = {
    padding: 20,
    height: "50vh",
    width: 300,
    margin: "20px auto",
  };
  // const avatarStyle = { backgroundColor: this.primary.main };
  const btstyle= {margin:'8px 0'}

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      // console.log('Loginページの確認',user.email); 
      setAccount(user.email);
    });
    return () => unSub();
  }, [props.history]);

  return (
    <>
    <Header/>
    <Grid>
      <Typography>
        {account &&<p> { account } としてログインしています。</p>}
      </Typography>
      <Paper elevation={3} style={paperStyle}>
        <Grid align="center">
          <Avatar>
            <LockIcon/>
          </Avatar>
          <h2>{isLogin ? "ログイン" : "アカウント登録"}</h2>
        </Grid>
          
          <TextField label="Email" 
            fullWidth 
            required
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></TextField>

          <Button type="submit" 
            color="primary" 
            variant="contained" 
            style={btstyle} 
            fullWidth
            onClick={
              isLogin
              ? async () => {
                  try {
                    // 作成時 firebaseに[signInWithEmailAndPassword]というものがあるのでそれに
                    // email, passwordで保持した状態を送り→成功すればhistoryによって画面遷移が実行される
                    await auth.signInWithEmailAndPassword(email, password);
                    props.history.push("/");
                  } catch (error) {
                    alert(error.message);
                  }
                }
              : async () => {
                try {
                  const credential = firebase.auth.EmailAuthProvider.credential(email, password);
                  console.log('credentialはこちら ', credential);
                  
                  auth.currentUser.linkWithCredential(credential)
                    .then((usercred) => {
                      const user = usercred.user;
                      console.log("匿名アカウントの永続化に成功しました", user);
                    }).catch((error) => {
                      console.log("匿名アカウントの永続化でエラー", error);
                    });
                  await auth.signInWithEmailAndPassword(email, password);
                  props.history.push("/");
                } catch (error) {
                  alert(error.message);
                }
              }
            }
            >
            {isLogin ? "ログイン" : "登録"}
            </Button>
          <Typography>
              <Link href="#" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "→アカウントを作成する" : "←ログイン画面に戻る"}
              </Link>
          </Typography>
      </Paper>
    </Grid>
    </>
  );
}



