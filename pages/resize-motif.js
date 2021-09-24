import React, { useState, useEffect ,useContext} from "react";
import Image from "next/image";
// import style from "../styles/resize.module.css";
import firebase from "firebase/app";
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
  // console.log(props.image.file);

  //firebaseに保存
  // const userId = "ZZeI9mOadD7wxmT26dqB";
  const userId = useContext(UserContext);
  const createRandom =()=>{
    const S ="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
    const N = 16; //16文字の文字列を作るという意味　生成したい文字数が１６の文字列になる
    const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
            .map((n) => S[n % S.length]).join("");
    return randomMoji ;
  }
  const metadata = {
    contentType: 'image/jpeg',
  };
  const saveDB = () => {
    if (userId) {
      const MotifRef = db.collection("users").doc(userId).collection("motif");
      console.log(props.id);
      if (!props.id) {
        const fileName = createRandom()+'_'+props.image.file.name;
        // firebase storageに登録する処理
        const uploadTweetImg = storage.ref(fileName).put(props.image.file,metadata);
        
        // firebaseのDBに登録する処理
        uploadTweetImg.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {}, //進捗度合いの管理するもの、
          (err) => { console.log(err.message);},
          async () => {
            //成功したとき
            await storage
              .ref(fileName)
              .getDownloadURL()
              .then(async (url) => {
                await MotifRef.add({
                      height: motif.height,
                      width: motif.width,
                      src: url,
                      tag: "",
                    })
                      .then((docRef) => {
                        console.log("Document written with ID: ", docRef.id);
                    })
                    .catch((error) => {
                      console.error("Error adding document: ", error);
                    });
              });
          }
        );
      }else{
        MotifRef.doc(props.id).set({
          height: motif.height,
          width: motif.width,
          src: props.src,
          tag: props.tag,
        })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
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
