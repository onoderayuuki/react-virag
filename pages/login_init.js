import React, { useState, useReducer, useEffect, useStyles } from "react";
// import { useForm } from "react-hook-form";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// import { useAuth } from "../contexts/AuthContext"
// import { Link } from "react-router-dom"
import { auth } from "../components/firebase";

import {
  Paper,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Link,
} from "@material-ui/core";
import Header from "../components/header.js";

export default function ForgotPassword(props) {
  const paperStyle = {
    padding: 20,
    height: "50vh",
    width: 300,
  };

  // const classes = useStyles();
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  // const { resetPassword } = useAuth()
  // const { register, handleSubmit, errors  } = useForm();

  const handleForgotPassword = async () => {
    console.log("handleForgotPassword");
    try {
      await auth.sendPasswordResetEmail(email);
      setSuccessMessage("パスワードを初期化しました。");
    } catch (e) {
      //エラーのメッセージの表示
      console.log("error",e);
      console.log("error",e.message);
      switch (e.message) {
        case "ReferenceError: auth is not defined":
          setError(
            "通信がエラーになったのか、またはタイムアウトになりました。通信環境がいい所で再度やり直してください。"
          );
          break;
        case "auth/invalid-email":
          setError("メールアドレスが間違えています。");
          break;
        case "auth is not defined":
          setError("メールアドレスのアカウントは存在しません。");
          break;
        case "auth/user-disabled":
          setError("入力されたメールアドレスは無効（BAN）になっています。");
          break;
        default:
          //想定外
          setError(
            "処理に失敗しました。通信環境がいい所で再度やり直してください。"
          );
      }
    }
  };

  return (
    <>
      <Header />

      <Paper elevation={3} style={paperStyle}>
        <Typography>
          <Link href="/login">←ログイン画面に戻る</Link>
        </Typography>

        <TextField
          label="Email"
          style={{ marginTop: "50px" }}
          fullWidth
          required
          onChange={(e) => setEmail(e.target.value)}
        ></TextField>

        <Button
          type="submit"
          style={{ marginTop: "30px" }}
          color="primary"
          variant="contained"
          fullWidth
          onClick={() => {
            handleForgotPassword();
          }}
        >
          送信
        </Button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {successMessage && <div variant="danger">{successMessage}</div>}
      </Paper>
    </>
  );
}

// export default ForgotPassword;
