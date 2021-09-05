import React, { useState, useEffect ,useContext} from "react";
import Image from "next/image";
// import style from "../styles/resize.module.css";
import { db, storage } from "../components/firebase";
import { UserContext } from "./_app.js";

import { makeStyles } from "@material-ui/core/styles";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import IconButton from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import Footer from "./footer.js";

const useStyles = makeStyles((theme) => ({
  resize_container: {
    backgroundColor: "#660000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  image: {
    paddingLeft: "10px",
    paddingBottom: "10px",
    borderBottom: "solid 1px white",
    borderLeft: "solid 1px white",
  },
  input: {
    height: "30px",
    width: "50px",
    marginLeft: "5px",
  },
  heightInput: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  widthInput: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
  },
}));

export default function ResizeMotif(props) {
  const style = useStyles();
  // const [motif, setMotif] = useState({ id: "1", height: "300", width: "200", src: "/test.png" });
  const [inputHeight, setInputHeight] = useState(props.height);
  const [inputWidth, setInputWidth] = useState(props.width);

  const [motif, setMotif] = useState({
    id: props.id,
    height: props.height,
    width: props.width,
    src: props.src,
  });

  //firebaseStrageに画像登録してパスをfirestoreに保存したい、本当は。
  // const handleUpload = async (accepterdImg: any) => {
  //   try {
  //     const uploadTask: any = storage
  //       // .ref(`/images/${myFiles[0].name}`)
  //       .ref(`/images/stragetest.png`)
  //       .put(myFiles[0]);

  //     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, next, error);
  //   } catch (error) {
  //     console.log("エラーキャッチ", error);
  //   }
  // };

  //firebaseに保存
  // const userId = "ZZeI9mOadD7wxmT26dqB";
  const userId = useContext(UserContext);

  const saveDB = () => {
    if (userId) {
      const MotifRef = db.collection("users").doc(userId).collection("motif");
      if (motif.id == "") {
        //追加
        console.log("add");
        MotifRef.add({
          height: motif.height,
          width: motif.width,
          src: props.src,
          tag: "",
        })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            window.location.href = "./home";
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      } else {
        //変更
        console.log("set");
        const docRef = MotifRef.doc(motif.id);
        console.log(docRef);
        docRef
          .set({
            height: motif.height,
            width: motif.width,
            src: props.src,
            tag: props.tag,
          })
          .then(() => {
            console.log("Document successfully written!");
            window.location.href = "./home";
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
      // window.location.href='./home'
    }
  };
  //数字変更に連動して高さを変える
  const changeHeight = (newHeight) => {
    // console.log(newHeight);
    const oldHeight = motif.height;
    const newWidth = (motif.width * newHeight) / oldHeight;
    setInputHeight(newHeight);
    setInputWidth(newWidth);
    if (newHeight != "" && newHeight > 0) {
        setMotif({ ...motif, height: newHeight, width: newWidth });
      // console.log("change");
    }
  };
  const changeWidth = (newWidth) => {
    // console.log(newHeight);
    const oldWidth = motif.width;
    const newHeight = (motif.height * newWidth) / oldWidth;
    setInputHeight(newHeight);
    setInputWidth(newWidth);
    if (newWidth != "" && newWidth > 0) {
        setMotif({ ...motif, height: newHeight, width: newWidth });
      // console.log("change");
    }
  };

  useEffect(() => {
    // console.log(props.height);
    setMotif({ height: props.height, width: props.width, src: props.src });
  }, [props.height, props.width]);

  return (
    <>
      <div className={style.resize_container}>
        <h3 className={style.text}>実際の縮尺を入力してください（mm）</h3>
        <Grid container spacing={1}>
          {/* 上段 */}
          <Grid item xs={3} className={style.heightInput}>
            <input
              className={style.input}
              type="number"
              id="height"
              value={inputHeight}
              onChange={(e) => changeHeight(e.target.value)}
            ></input>
          </Grid>
          <Grid item xs={9}>
            <Image
              src={motif.src}
              alt="Motif Image"
              height={(motif.height * 72) / 25.4}
              width={(motif.width * 72) / 25.4}
              style={style.image}
            />
          </Grid>
          {/* 下段 */}
          <Grid item xs={4}></Grid>
          <Grid item xs={8} className={style.widthInput}>
            <input
              className={style.input}
              type="number"
              value={inputWidth}
              onChange={(e) => changeWidth(e.target.value)}
            />
          </Grid>
        </Grid>
      </div>
      <Footer>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="save"
          onClick={() => {
            saveDB();
          }}
        >
          <div>
          <SaveRoundedIcon />
          <p style={{fontSize:'10px'}}>保存</p>
            </div>
        </IconButton>
      </Footer>
    </>
  );
}
ResizeMotif.defaultProps = { src: "/test.png" };
