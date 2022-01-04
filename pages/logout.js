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

  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    auth.signOut()
    const unSub = auth.signOut().then(() => {
      setAccount("");
    })
    return () => unSub();
  }, [props.history]);

  const ErrorSet = (e) => {
    console.log(e); 
    switch (e.code) {
      case "":
        setError(NULL);
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
      default:
        //想定外
        setError(
          "処理に失敗しました。"
        );
    }
  };



  return (
    <>
      <Header>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Virág
        </Typography>
      </Header>

        {!account && (
          <Paper elevation={3} style={paperStyle}>
          <Typography>
            <p> ログアウトしました</p>
            <p><Link href="/"> HOME </Link></p>
            <p><Link href="/login"> 別のアカウントでログイン </Link></p>
          </Typography>
          </Paper>
        )}
    </>
  );
}
