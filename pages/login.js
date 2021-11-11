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
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';

// import { EmailAuthProvider,getAuth, linkWithCredential } from "firebase/auth";
import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { auth,db } from "../components/firebase";

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
          db.collection("users").doc(user.uid).set({name: user.email,created_at: getCurrentDate("/"),})
          .then(() => {
            console.log("名前登録しました", user.uid);
          })
          .catch((error) => {
            console.error(": ", error);
          }); 
          console.log("匿名アカウントの永続化に成功しました", user);
          setAccount(user.email);
          setSuccessMessage("アカウントが登録できました。");

          auth.signInWithEmailAndPassword(email, password);

        })
        .catch((e) => {
          console.log("匿名アカウントの永続化でエラー", e);
          ErrorSet(e);
        });

      // props.history.push("/");
    } catch (e) {
      console.log("catch");
      ErrorSet(e);
    }
  };

  const LogIn = async () => {
    try {
      // 作成時 firebaseに[signInWithEmailAndPassword]というものがあるのでそれに
      // email, passwordで保持した状態を送り→成功すればhistoryによって画面遷移が実行される
      await auth.signInWithEmailAndPassword(email, password);
      auth.currentUser
        .linkWithCredential(credential)
        .then((usercred) => {
          const user = usercred.user;
          console.log("ログインできました", user);
          setAccount(user.email);
          setSuccessMessage("ログインしました。");
        })
        .catch((e) => {
          console.log("ログインエラー", e);
          ErrorSet(e);
        });
      
      // props.history.push("/");
    } catch (e) {
      ErrorSet(e);
    }
  };

  const ForgotPassword = async () => {
    console.log("handleForgotPassword");
    try {
      auth.sendPasswordResetEmail(email);
      setSuccessMessage("パスワード初期化の為のメールを送信しました。");
    } catch (e) {
      //エラーのメッセージの表示
      ErrorSet(e);
    }
  };

  const ErrorSet = (e) => {
    console.log(e);
    switch (e.code) {
      case "":
        setError("");
      case "auth/network-request-failed":
        setError(
          "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。"
        );
        break;
      case "auth/weak-password":
        setError("パスワードは６文字以上で設定してください。");
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
        case "auth/wrong-password":
          setError("パスワードが間違っています。");
          break;
      default:
        //想定外
        setError("処理に失敗しました。");
    }
  };

  const handleClick = () => {
    setError("");
    if (mode == "CreateAccount") {
      CreateAccount();
    } else if (mode == "ForgotPassword") {
      ForgotPassword();
    } else {
      LogIn();
    }
  };

  return (
    <>
      <Header>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Virag
        </Typography>
      </Header>
      <Grid>
        {account && (
          <Paper elevation={3} style={paperStyle}>
            <Grid align="center">
              <Avatar>
                <AccountCircleRoundedIcon />
              </Avatar>
              <p>
                {account}
                <br />
                としてログインしています。
              </p>
            </Grid>
            <Typography>
              <p>
                <Link href="/"> HOME</Link>
              </p>
              <p>
                <Link href="/logout"> ログアウト</Link>
              </p>
            </Typography>
          </Paper>
        )}

        {!account && (
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

            {mode != "ForgotPassword" && (
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
            )}

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
              <Typography
                style={{ marginTop: "30px" }}
                onClick={() => {
                  setMode("Login");
                  setError("");
                }}
              >
                <Link href="#">←ログイン画面に戻る</Link>
              </Typography>
            )}
            {mode == "Login" && (
              <>
                <Typography
                  style={{ marginTop: "30px" }}
                  onClick={() => {
                    setMode("CreateAccount");
                    setError("");
                  }}
                >
                  <Link href="#">→アカウントを作成する</Link>
                </Typography>
                <Typography
                  style={{ marginTop: "5px" }}
                  onClick={() => {
                    setMode("ForgotPassword");
                    setError("");
                  }}
                >
                  <Link href="#"> →パスワードを初期化する</Link>
                </Typography>
              </>
            )}
          </Paper>
        )}
      </Grid>
    </>
  );
}
