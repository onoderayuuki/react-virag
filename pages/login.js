import {
  Grid,
  Paper,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Link,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";

// import { EmailAuthProvider,getAuth, linkWithCredential } from "firebase/auth";
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { auth } from "../components/firebase";

import Header from "../components/header.js";

export default function Login(props) {
  const paperStyle = {
    padding: 20,
    height: "60vh",
    width: 300,
    margin: "20px auto",
  };
  // const avatarStyle = { backgroundColor: this.primary.main };

  const [mode, setMode] = useState("Login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const unSub = auth.onAuthStateChanged((user) => {
      // console.log('Loginページの確認',user.email);
      setAccount(user.email);
    });
    return () => unSub();
  }, [props.history]);

  const CreateAccount = async () => {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        password
      );
      console.log("credentialはこちら ", credential);

      auth.currentUser
        .linkWithCredential(credential)
        .then((usercred) => {
          const user = usercred.user;
          console.log("匿名アカウントの永続化に成功しました", user);
          setSuccessMessage("アカウントが登録できました。");
        })
        .catch((e) => {
          console.log("匿名アカウントの永続化でエラー", e);
          ErrorSet(e);
        });
      await auth.signInWithEmailAndPassword(email, password);
      // props.history.push("/");
    } catch (e) {
      ErrorSet(e);
    }
  };

  const LogIn = async () => {
    try {
      // 作成時 firebaseに[signInWithEmailAndPassword]というものがあるのでそれに
      // email, passwordで保持した状態を送り→成功すればhistoryによって画面遷移が実行される
      await auth.signInWithEmailAndPassword(email, password);
      setSuccessMessage("ログインしました。");
      // props.history.push("/");
    } catch (e) {
      ErrorSet(e);
    }
  };

  const ForgotPassword = async () => {
    console.log("handleForgotPassword");
    try {
      auth.sendPasswordResetEmail(email);
      setSuccessMessage("パスワードを初期化しました。");
    } catch (e) {
      //エラーのメッセージの表示
      ErrorSet(e);
    }
  };

  const ErrorSet = (e) => {
    console.log(e);
    switch (e.code) {
      case "auth/network-request-failed":
        setError(
          "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。"
        );
        break;
      case "auth/invalid-email":
        setError("メールアドレスが間違えています。");
        break;
      case "auth/user-not-found":
        setError("メールアドレスのアカウントは存在しません。");
        break;
        case "auth/email-already-exists":
          setError("入力されたメールアドレスは既に登録されています。");
          break;
      case "auth/user-disabled":
        setError("入力されたメールアドレスは無効（BAN）になっています。");
        break;
      default:
        //想定外
        setError(
          "処理に失敗しました。"
        );
    }
  };

  const handleClick = () => {
    setError("");
    if ((mode == "CreateAccount")) {
      CreateAccount();
    } else if ((mode == "ForgotPassword")) {
      ForgotPassword();
    } else {
      LogIn();
    }
  };

  return (
    <>
      <Header />
      <Grid>
        {account && (
          <Typography>
            <p> {account} としてログインしています。</p>
            <Link href="/"> HOME へ</Link>
          </Typography>
        )}

        <Paper elevation={3} style={paperStyle}>
          <Grid align="center">
            <Avatar>
              <LockIcon />
            </Avatar>
            {mode == "Login" && <h2>ログイン</h2>}
            {mode == "CreateAccount" && <h2>アカウント登録</h2>}
            {mode == "ForgotPassword" && <h2>パスワード初期化</h2>}
          </Grid>

          <TextField
            label="Email"
            style={{ marginTop: "20px" }}
            fullWidth
            required
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>

          {mode != "ForgotPassword" && 
          <TextField
            label="Password"
            type="password"
            style={{ marginTop: "20px" }}
            fullWidth
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></TextField>
          }

          <Button
            type="submit"
            color="primary"
            variant="contained"
            style={{ marginTop: "30px" }}
            fullWidth
            onClick={handleClick}
          >
            {mode == "Login" && "ログイン"}
            {mode == "CreateAccount" && "登録"}
            {mode == "ForgotPassword" && "送信"}
          </Button>

          {error && <div style={{ color: "red" }}>{error}</div>}
          {successMessage && <div variant="danger">{successMessage}</div>}
      
          {mode != "Login" && (
            <Typography style={{ marginTop: "30px" }} onClick={()=>{setMode("Login")}}>
              <Link href="#">←ログイン画面に戻る</Link>
            </Typography>
          )}
          {mode == "Login" && (
            <>
              <Typography style={{ marginTop: "30px" }} onClick={()=>{setMode("CreateAccount")}}>
                <Link href="#">→アカウントを作成する</Link>
              </Typography>
              <Typography style={{ marginTop: "5px" }} onClick={()=>{setMode("ForgotPassword")}}>
                <Link href="#"> →パスワードを初期化する</Link>
              </Typography>
            </>
          )}
        </Paper>
      </Grid>
    </>
  );
}
