// import Image from "next/image";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import NextImage from "next/image";
import useImage from "use-image";
import { triggerBase64Download } from "react-base64-downloader";

import Box from "@material-ui/core/Box";
import Modal from "@material-ui/core/Modal";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import FlipToFrontRoundedIcon from "@material-ui/icons/FlipToFrontOutlined";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import QueueRoundedIcon from "@material-ui/icons/QueueRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import LoopRoundedIcon from "@material-ui/icons/LoopRounded";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import SaveAltRoundedIcon from "@material-ui/icons/SaveAltRounded";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import Chip from "@material-ui/core/Chip";
// import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from "@material-ui/icons/Done";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import SwapHorizSharpIcon from "@material-ui/icons/SwapHorizSharp";
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography";

import { Stage, Layer, Image, Transformer } from "react-konva";

import Header from "./header.js";
import Toolbar from "./toolbar.jsx";
import { IconButton } from "@material-ui/core";

import firebase from "firebase/app";
import { db } from "./firebase";
import { UserContext } from "../pages/_app";

const URLImage = ({ image, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
    // console.log(trRef.current);
  }, [isSelected]);

  const [img] = useImage(image.src, "Anonymous");
  return (
    <>
      <Image
        image={img}
        alt="#"
        x={image.x}
        y={image.y}
        height={(image.height * 72) / 25.4}
        width={(image.width * 72) / 25.4}
        rotation={image.rotation}
        scaleX={image.scaleX}
        draggable={isSelected}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        onDragEnd={onChange}
        onTouchEnd={onChange}
        onTransformEnd={onChange}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          resizeEnabled={false}
          flipEnabled={false}
          anchorCornerRadius={1}
        />
      )}
    </>
  );
};
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "scroll",
    marginTop: "10px",
    marginLeft: "10px",
    height: "45vh",
  },
  imageList: {
    width: 500,
    height: 450,
  },
  subtitle: {
    textAlign:'right',
  },
  titleBar: {
    height:"20%",
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));

export default function Canvas() {
  //ID取得
  // const userId = "ZZeI9mOadD7wxmT26dqB";
  const userId = useContext(UserContext);
  const router = useRouter();
  const [saveId,setSaveId]=useState();
  const {
    query: { designId },
  } = router;
  // const designId = "BnQefnu48iQeVYDCa8hw";

  //追加用データ
  const [tags, setTags] = useState([
    {
      name: "tag0",
      onoff: true,
      motifs: [
        {
          id: "cccc",
          height: "100",
          width: "100",
          src: "/test3.png",
          tag: "tag0",
        },
        {
          id: "dddd",
          height: "100",
          width: "100",
          src: "/test4.png",
          tag: "tag0",
        },
      ],
    },
    {
      name: "tag1",
      onoff: true,
      motifs: [
        { id: "a", height: "100", width: "100", src: "/test.png", tag: "tag1" },
        {
          id: "b",
          height: "100",
          width: "100",
          src: "/test2.png",
          tag: "tag1",
        },
      ],
    },
    {
      name: "tag2",
      onoff: true,
      motifs: [
        { id: "f", height: "100", width: "100", src: "/test.png", tag: "tag2" },
        {
          id: "h",
          height: "100",
          width: "100",
          src: "/test2.png",
          tag: "tag2",
        },
      ],
    },
  ]);
  const [tagNames, setTagNames] = useState([""]);

  //キャンバス用データ

  const [backImage, setBackImage] = useState({
    src: "https://firebasestorage.googleapis.com/v0/b/virag-d7f0f.appspot.com/o/zNUDpvE4tkoOeyAU6VcG.png?alt=media&token=d0ed3a29-bb5d-41e5-8129-6a497e96bca9",
    // src: "./back_A4.png",
    x: 0,
    y: 0,
    rotation: 0,
    height: 297,
    width: 210,
  });

  // const [images, setImages] = useState([
  //   { id:"1acd" ,src: "./test2.png", x: 100, y: 20, rotation: 0 ,scaleX:1 ,width:30,height:30},
  //   { id:"2erya" ,src: "./test3.png", x: 10, y: 200, rotation: 0 ,scaleX:1 ,width:30,height:30},
  // ]);
  const [images, setImages] = useState([]);
  const [motifs, setMotifs] = useState([]);
// const [motifs, setMotifs] = useState([
  //   { id: "aaaa", height: "50", width: "50", src: "/test.png", tag: "tag1" },
  //   { id: "bbbb", height: "50", width: "50", src: "/test2.png", tag: "tag2" },
  //   { id: "cccc", height: "100", width: "100", src: "/test3.png", tag: "" },
  //   { id: "dddd", height: "100", width: "100", src: "/test2.png", tag: "" },
  // ]);

  //DB取得関連
  const seriesID = "e6sk0UkXAxNpLeRlJlFpWzZJNMA3";
  const SeriesRef = db.collection("series").doc(seriesID);
  const MotifRef = db.collection("motif");
  

  //ランダムID生成関数
  function getUniqueStr(myStrong) {
    var strong = 1000;
    if (myStrong) strong = myStrong;

    return (
      new Date().getTime().toString(16) +
      Math.floor(strong * Math.random()).toString(16)
    );
  }

  //データ取得
  useEffect(() => {
    setSaveId(designId);
    if (userId) {
      const designRef = db.collection("users").doc(userId).collection("design");

      if (designId != "new") {
        designRef
          .doc(designId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              // console.log("Document data:", doc.data());
              setImages(doc.data().images);
              setBackImage(doc.data().backImage);
            } else {
              // doc.data() will be undefined in this case
              // console.log("No such document!",designId);
              db.collection("design").doc(designId).get().then((doc2) => {
                if (doc2.exists) {
                  // console.log("Document data:", doc.data());
                  setImages(doc2.data().images);
                  setBackImage(doc2.data().backImage);
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document!",designId);
                }
              })
              .catch((error) => {
                console.log("Error getting design:", error);
              });
            }
          })
          .catch((error) => {
            console.log("Error getting design:", error);
          });
      }

    }

    SeriesRef.get()
      .then((doc) => {
        if (doc.exists) {
          // console.log("SeriesDocument data:", doc.data());
          let newTags = doc.data().tagNames;
          // newTags.push("");
          // console.log(newTags);
          const newTags2 = newTags.filter(function (tag) {
            return tag != "背景";
          });
          // setTagNames(newTags2);
          setTagNames([...newTags2,""] );

          const SeriesRef2 = db.collection("users").doc(userId).collection("series").doc(userId);
          SeriesRef2.get()
          .then((doc2) => {
            console.log(doc2);
            if (doc2.exists) {
              let newTags3 = doc2.data().tagNames;
              const newTags4 = newTags3.filter(function (tag) {
                return tag != "背景";
              });
              console.log([...newTags2,...newTags4]);
              setTagNames([...newTags2 , ...newTags4,""]);
            } else {
              console.log("No such Seriesdocument!",userId);
            }
          })
          .catch((error) => {
            console.log("Error getting series:", error);
          });
        } else {
          console.log("No such Seriesdocument!",seriesID);
        }
      })
      .catch((error) => {
        console.log("Error getting series:", error);
      });
      
     MotifRef.get().then((snapshot) => {
      // setMotifs(
        const motifs1 = snapshot.docs.map((dbData) => ({
          id: dbData.id,
          height: dbData.data().height,
          width: dbData.data().width,
          src: dbData.data().src,
          tag: dbData.data().tag,
        }));
      // );
        const MotifRef2 = db.collection("users").doc(userId).collection("motif");
        MotifRef2.get().then((snapshot2) => {
          // setMotifs(
            const motifs2 = snapshot2.docs.map((dbData) => ({
              id: dbData.id,
              height: dbData.data().height,
              width: dbData.data().width,
              src: dbData.data().src,
              tag: dbData.data().tag,
            }));
            const newmotifs = motifs1.concat(motifs2);
            setMotifs([...newmotifs]);
          // );        
        }).catch((error) => {
          console.log("Error getting motifs: ", error);
        });
    }).catch((error) => {
      console.log("Error getting motifs: ", error);
    });

  }, []);

  const handleTouch = (e) => {
    //  console.log(e.target.getStage().scaleX());
    const stage = e.target.getStage();
    if (e.evt.touches.length >= 2) {
      getMultiTouchOnStage(e.evt.touches[0], e.evt.touches[1], stage);
    } else {
      checkDeselect(e);
    }
  };
  //選択
  const [selectedId, selectShape] = useState(null);
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    // console.log(e.target);
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  //変更と履歴
  const [history, setHistory] = useState([images]);
  const [historyStep, setHistoryStep] = useState(0);

  const updateImages = (newImages) => {
    // console.log("updateImage:",newImages);
    setImages(newImages);
    setHistory([...history, newImages]);
    setHistoryStep(historyStep + 1);
  };
  const handleUndo = () => {
    setHistoryStep(historyStep - 1);
    setImages(history[historyStep]);
  };
  const handleRedo = () => {
    setHistoryStep(historyStep + 1);
    setImages(history[historyStep]);
  };

  //追加エリア
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [addMode, setAddMode] = useState("change");

  const handleOpen = (mode, tagArray) => {
    console.log(mode);
    setAddMode(mode);
    let array = [];
    tagArray.map((tagName) => {
      const thisMotifs = motifs.filter(function (motif) {
        return motif.tag == tagName;
      });
      array.push({ name: tagName, onoff: true, motifs: thisMotifs });
    });
    setTags(array);
    // console.log(array);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "50vh",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 1,
    p: 4,
  };

  //追加エリア内のモチーフクリック
  const handleMotifClick = (motif) => {
    if (addMode == "add") {
      const x = Math.floor(Math.random() * 100);
      const y = Math.floor(Math.random() * 5);
      const randomID = getUniqueStr(10);
      // console.log(motif,randomID);
      const newImages = [
        ...images,
        {
          id: randomID,
          src: motif.src,
          x: x,
          y: y,
          rotation: 0,
          scaleX: 1,
          width: motif.width,
          height: motif.height,
          tag: motif.tag,
        },
      ];
      updateImages(newImages);
    } else if (addMode == "change") {
      const newOne = images.find((image) => image.id == selectedId);
      const otherImages = images.filter(function (image) {
        return image.id != selectedId;
      });
      const newImages = [
        ...otherImages,
        { ...newOne, src: motif.src, width: motif.width, height: motif.height },
      ];
      // console.log(newImages);
      updateImages(newImages);
    }else if (addMode == "back"){
      setBackImage({...backImage,src: motif.src, width: motif.width, height: motif.height })
    }

  };

  //削除
  const handleDelete = () => {
    const newImages = images.filter(function (image) {
      return image.id != selectedId;
    });
    updateImages(newImages);
    selectShape(null);
  };

  //コピー
  const handleCopy = () => {
    const newOne = images.find((image) => image.id == selectedId);
    const randomID = getUniqueStr(10);
    const newImages = [
      ...images,
      {
        ...newOne,
        id: randomID,
        x: newOne.x + 10,
        y: newOne.y + 10,
        rotation: newOne.rotation,
        scaleX: newOne.scaleX,
      },
    ];
    // console.log(newImages);
    updateImages(newImages);
  };

  //反転
  const handleMirror = () => {
    const selectImage = images.find((image) => image.id == selectedId);
    const nowScaleX = selectImage.scaleX;
    const otherImages = images.filter(function (image) {
      return image.id != selectedId;
    });
    const newImages = [...otherImages, { ...selectImage, scaleX: -nowScaleX }];
    // console.log({ ...selectImage, x:selectImage.x+300*nowScaleX ,scaleX: -nowScaleX});
    updateImages(newImages);
  };

  //入れ替え
  const handleChange = () => {
    console.log("change");
    const selectImage = images.find((image) => image.id == selectedId);
    console.log(selectImage.tag);
    handleOpen("change", [selectImage.tag]);
  };

  //ダウンロードと保存
  // const base64 =
  //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuNv1OCegAAAAMSURBVBhXY/jPYAwAAzQBM849AKsAAAAASUVORK5CYII=';

  const stageRef = useRef(null);

  const adjustCanvas = () =>{
    //全体が写るようにスケール変更
    // console.log(backImage.height);
    // console.log(stageRef.current.attrs.width);
    stageRef.current.attrs.width = ((backImage.width * 72) / 25.4)
    stageRef.current.attrs.width = ((backImage.width * 72) / 25.4)
  }
  
  const downloadImage = () => {
    adjustCanvas();
    
    const dataURL = stageRef.current.toDataURL({
      pixelRatio:2/stageRef.current.attrs.scaleX
    });

    triggerBase64Download(dataURL, saveId);
  };
    //保存メッセージ
    const [saved, setSaved] = useState(false);
    

  const saveDB = () => {
    const scale = 200 / ((backImage.height * 72) / 25.4);
    console.log("save: ", saveId);
    console.log(
      scale,
      (backImage.height * 72) / 25.4,
      ((backImage.height * 72) / 25.4) * scale
    );
    const designRef = db.collection("users").doc(userId).collection("design");
    if (saveId == "new") {
      designRef
        .add({
          backImage: backImage,
          images: images,
          base64: stageRef.current.toDataURL({ pixelRatio: scale }),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
          setSaveId(docRef.id);
          setSaved(true);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    } else {
      designRef
        .doc(saveId)
        .set({
          backImage: backImage,
          images: images,
          base64: stageRef.current.toDataURL({ pixelRatio: scale }),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log("Document successfully written!",saveId);
          setSaved(true);
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    }
    
  };

  const handleTagClick = (i) => {
    const newTags = tags.slice();
    newTags[i]["onoff"] = !tags[i]["onoff"];
    setTags(newTags);
    // console.log(i);
    // console.log(tags[i]['onoff']);
  };

  //ページの拡大縮小
  const getCenter = (p1, p2) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  };
  const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };
  const [lastDist, setLastDist] = useState(null);
  const [lastCenter, setLastCenter] = useState(null);

  const getMultiTouchOnStage = (touch1, touch2, stage) => {
    if (touch1 && touch2) {
      // if the stage was under Konva's drag&drop
      // we need to stop it, and implement our own pan logic with two pointers
      const P1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const P2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      // console.log(P1,P2);

      const newCenter = getCenter(P1, P2);
      const dist = getDistance(P1, P2);

      const ratio = lastDist ? dist / lastDist : 1;
      const scale = stage.scaleX() * ratio;
      console.log(dist, lastDist);
      console.log(stage.scaleX(), ratio);
      // console.log(ratio,scale)

      // local coordinates of center point
      const pointTo = {
        x: (newCenter.x - stage.x()) / stage.scaleX(),
        y: (newCenter.y - stage.y()) / stage.scaleY(),
      };
      // // calculate new position of the stage
      const dx = lastCenter ? newCenter.x - lastCenter.x : 0;
      const dy = lastCenter ? newCenter.y - lastCenter.y : 0;

      const newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };

      console.log(stage.position(), stage.x(), stage.y());
      if (scale > 0.1) {
        stage.scaleX(scale);
        stage.scaleY(scale);
        stage.position(newPos);
        setLastDist(dist);
        setLastCenter(newCenter);
      }
    }
  };
  const handleTouchEnd = () => {
    setLastDist(null);
    setLastCenter(null);
  };

  return (
    <div style={{ backgroundColor: "#F6F3EC" }}>
      <Header>
        <Typography variant="subtitle1" style={{flexGrow:1}}>
          {Math.ceil(backImage.height)} x {Math.ceil(backImage.width)} mm
        </Typography>

        <IconButton
          color="primary"
          style={{ padding: "4px" }}
          onClick={downloadImage}
        >
          <div>
            <SaveAltRoundedIcon fontSize="large" />
            <p style={{ fontSize: "9px", margin: "1px" }}>ダウンロード</p>
          </div>
        </IconButton>
        
        <IconButton color="primary" style={{ padding: "4px" }} onClick={saveDB}>
          <div>
            <SaveRoundedIcon fontSize="large" />
            <p style={{ fontSize: "10px", margin: "1px" }}>保存</p>
          </div>
        </IconButton>
      </Header>
      <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={saved}
          autoHideDuration={6000}
          onClose={()=>{setSaved(false)}}
          message="保存しました"
          action={
            <>
              <IconButton size="small" aria-label="close" color="inherit" onClick={()=>{setSaved(false)}}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
        }
      />
      {/* モーダル */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            {tags.map((tag, i) => {
              return (
                <Chip
                  key={i}
                  label={tag.name}
                  clickable
                  color={tag.onoff ? "primary" : "default"}
                  style={{ marginLeft: "4px" }}
                  onClick={() => handleTagClick(i)}
                />
              );
            })}
          </Box>
          <div className={classes.root}>
            <ImageList className={classes.imageList} rowHeight={100} cols={2}>
              {tags.map((tag) =>
                tag.motifs.map(
                  (motif, i) =>
                    tag.onoff && motif.src != "" &&(
                          <ImageListItem
                            key={i}
                          >
                          <NextImage
                            key={i}
                            src={motif.src}
                            alt={"image"}
                            height={100}
                            width={100}
                            onClick={(e) => {
                              handleMotifClick(motif);
                            }}
                          />
                          <ImageListItemBar
                              subtitle={Math.ceil(motif.height) +'x' +Math.ceil(motif.width)+' : ' +motif.id}
                              classes={{
                                root: classes.titleBar,
                                subtitle: classes.subtitle,
                              }}
                            />
                        </ImageListItem>
                    )
                )
              )}
            </ImageList>
          </div>
        </Box>
      </Modal>

      {/* CANVAS */}
      <Stage
        ref={stageRef}
        width={window.innerWidth * 0.95}
        height={window.innerHeight * 0.8}
        x={0}
        y={0}
        scaleX={1}
        scaleY={1}
        // onMouseDown={checkDeselect}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
      >
        <Layer>
          <URLImage
            image={backImage}
            isSelected={false}
            onSelect={() => {
              selectShape(null);
            }}
            onChange={() => {}}
          />
          {images.map((image, i) => {
            return (
              <URLImage
                key={i}
                image={image}
                isSelected={image.id === selectedId}
                onSelect={() => {
                  selectShape(image.id);
                }}
                onChange={(e) => {
                  console.log(e.target.x());
                  const newImages = images.slice();
                  newImages[i] = {
                    ...image,
                    x: e.target.x(),
                    y: e.target.y(),
                    rotation: e.target.rotation(),
                  };
                  updateImages(newImages);
                }}
              />
            );
          })}
        </Layer>
      </Stage>

      {/* FOOTER */}
      <Toolbar>
        <IconButton
          color="primary"
          onClick={() => handleOpen("back", ["背景"])}
          style={{ padding: "0" }}
        >
          <div>
            <FlipToFrontRoundedIcon fontSize="large" />
            <p style={{ fontSize: "10px" }}>背景</p>
          </div>
        </IconButton>
        <IconButton
          disabled={historyStep < 1}
          color="primary"
          onClick={handleUndo}
          style={{ padding: "0" }}
        >
          <div>
            <ArrowBackIosRoundedIcon fontSize="large" />
            <p style={{ fontSize: "10px" }}>戻る</p>
          </div>
        </IconButton>
        <IconButton
          disabled={historyStep >= history.length - 1}
          color="primary"
          onClick={handleRedo}
          style={{ padding: "0" }}
        >
          <div>
            <ArrowForwardIosRoundedIcon fontSize="large" />
            <p style={{ fontSize: "10px" }}>進む</p>
          </div>
        </IconButton>
        <IconButton
          disabled={!selectedId}
          color="primary"
          onClick={handleCopy}
          style={{ paddingTop: "5px" }}
        >
          <div>
            <QueueRoundedIcon fontSize="large" />
            <p style={{ fontSize: "10px" }}>コピー</p>
          </div>
        </IconButton>
        <IconButton
          disabled={!selectedId}
          color="primary"
          onClick={handleMirror}
          style={{ padding: "0" }}
        >
          <div>
            <SwapHorizSharpIcon fontSize="large" />
            <p style={{ fontSize: "10px" }}>反転</p>
          </div>
        </IconButton>
        <IconButton
          disabled={!selectedId}
          color="primary"
          onClick={handleDelete}
          style={{ padding: "0" }}
        >
          <div>
            <DeleteRoundedIcon fontSize="large" />
            <p style={{ fontSize: "10px" }}>削除</p>
          </div>
        </IconButton>
        <IconButton
          disabled={!selectedId}
          color="primary"
          onClick={handleChange}
          style={{ padding: "0" }}
        >
          <div>
            <LoopRoundedIcon fontSize="large" />
            <p style={{ fontSize: "10px" }}>置き換え</p>
          </div>
        </IconButton>
      </Toolbar>
      <Fab
        color="primary"
        aria-label="add"
        style={{ bottom: "130px", left: "300px" }}
        onClick={() => handleOpen("add", tagNames)}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
