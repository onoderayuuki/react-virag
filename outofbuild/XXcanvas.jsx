// import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import NextImage from "next/image";
import useImage from "use-image";

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
import Chip from "@material-ui/core/Chip";
// import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from "@material-ui/icons/Done";
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';

import { Stage, Layer, Image, Transformer } from "react-konva";
import { db } from "firebase";
import firebase from "firebase/app";

import Header from "../components/header.js";
import Toolbar from "../components/toolbar.jsx";
import { IconButton } from "@material-ui/core";

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

  const [img] = useImage(image.src);
  return (
    <>
      <Image
        image={img}
        alt="#"
        x={image.x}
        y={image.y}
        rotation={image.rotation}
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
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'scroll',
    marginTop:'10px',
    marginLeft:'10px',
    height:'45vh'
  },
  imageList: {
    width: 500,
    height: 450,
  },
}));

export default function Canvas() {
  //ID取得
  const userId = "ZZeI9mOadD7wxmT26dqB";
  // const router = useRouter();
  // const {
  //   query: { designId },
  // } = router;
  const designId = "BnQefnu48iQeVYDCa8hw";

  //追加用データ
  const [tags, setTags] = useState([
    {name:"tag0",onoff:true,motifs:[
      { id: "cccc", height: "100", width: "100", src: "/test3.png", tag: "tag0" },
      { id: "dddd", height: "100", width: "100", src: "/test4.png", tag: "tag0" }]
    },
    {name:"tag1",onoff:false,motifs:[
      { id: "a", height: "100", width: "100", src: "/test.png", tag: "tag1" },
      { id: "b", height: "100", width: "100", src: "/test2.png", tag: "tag1" }
    ]}, 
    {name:"tag2",onoff:false,motifs:[
      { id: "f", height: "100", width: "100", src: "/test.png", tag: "tag2" },
      { id: "h", height: "100", width: "100", src: "/test2.png", tag: "tag2" }
    ]}
  ]);
  

  //キャンバス用データ
  const [backImage, setBackImage] = useState({});
  const [images, setImages] = useState([]);

  const docRef = db
    .collection("users")
    .doc(userId)
    .collection("design")
    .doc(designId);
    
    
    const seriesID = "IC3cHj3Vew9FUuy84BUg";
    const SeriesRef = db.collection("series").doc(seriesID);
    const MotifRef = db.collection("motif");
    const [motifs, setMotifs] = useState([]);
    const [tagNames, setTagNames] = useState([]);

    useEffect(() => {
      docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setImages(doc.data().images);
          setBackImage(doc.data().backImage);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

      SeriesRef.get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data());
            setTagNames(doc.data().tagNames);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
      const MotifData = MotifRef.onSnapshot((snapshot) => {
        setMotifs(
          snapshot.docs.map((dbData) => ({
            id: dbData.id,
            height: dbData.data().height,
            width: dbData.data().width,
            src: dbData.data().src,
            tag: dbData.data().tag,
          }))
        );
        let array = [];
        tagNames.map((tagName)=>{
            const thisMotifs =  motifs.filter(function(motif) {
                return motif.tag == tagName;
            })
            array.push({name: tagName,onoff: true,motifs:thisMotifs});
        })
        setTags(array);
      });
      return () => MotifData();

    }, []);
    
  //選択
  const [selectedId, selectShape] = useState(null);
  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    console.log(e.target);
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };
  //変更と履歴
  const [history, setHistory] = useState([images]);
  const [historyStep, setHistoryStep] = useState(0);

  const handleAddClick = (src) => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 5);
    const newImages = [
      ...images,
      { id: images.length, src: src, x: x, y: y, rotation: 0 },
    ];
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
  const handleOpen = () => setOpen(true);
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

  //ダウンロードと保存
  const stageRef = useRef(null);
  const downloadImage = () => {
    const dataURL = stageRef.current.toDataURL();
    console.log(downloadImage);
  };
  const saveDB = () => {
    console.log("save: ", designId);
    docRef.set({
      backImage: backImage,
      images: images,
      base64: stageRef.current.toDataURL(),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };
  const handleTagClick=(i) =>{
    const newTags = tags.slice();
    newTags[i]['onoff']=!tags[i]['onoff']
    setTags(newTags);
    // console.log(i);
    // console.log(tags[i]['onoff']);
  };

  return (
    <div style={{ backgroundColor: "#F6F3EC" }}>
      <Header>
        <IconButton disabled color="primary">
          <SaveAltRoundedIcon fontSize="large" />
        </IconButton>
        <IconButton color="primary" onClick={saveDB}>
          <SaveRoundedIcon fontSize="large" />
        </IconButton>
      </Header>
      {/* モーダル */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            {tags.map((tag,i) => {
              return(
                <Chip
                key = {i}
                label={tag.name}
                clickable
                color={tag.onoff ? "primary":"" }
                style={{ marginLeft:'4px' }}
                onClick={() => handleTagClick(i)}
              />
              );
            })}
          </Box>
          <div className={classes.root}>
          <ImageList className={classes.imageList} rowHeight={100} cols={2}>
          {tags.map((tag) => (
            tag.motifs.map((motif,i) => (
              tag.onoff && (<ImageListItem 
                key={i} 
                // cols={motif.cols || 1}
              >
                {motif.src != "" && (
                  <NextImage
                  key={i}
                  src={motif.src}
                  height={100}
                  width={100}
                  onClick={(e) => {
                    handleAddClick(e.target.src);
                  }}
                />
                  )}
                </ImageListItem>)
              ))
            ))}
        </ImageList>
        </div>
        </Box>
      </Modal>
      <Stage
        ref={stageRef}
        width={window.innerWidth * 0.95}
        height={window.innerHeight * 0.85}
        onMouseDown={checkDeselect}
        onTouch={checkDeselect}
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
                  // console.log(e.target.y())
                  // console.log(e.target.rotation())
                  const newImages = images.slice();
                  newImages[i] = {
                    ...image,
                    x: e.target.x(),
                    y: e.target.y(),
                    rotation: e.target.rotation(),
                  };
                  setImages(newImages);
                  setHistory([...history, newImages]);
                  setHistoryStep(historyStep + 1);
                  // console.log(newImages);
                }}
              />
            );
          })}
        </Layer>
      </Stage>

      <Toolbar>
        <IconButton color="primary" onClick={downloadImage}>
          <FlipToFrontRoundedIcon fontSize="large" />
        </IconButton>
        <IconButton
          disabled={historyStep < 1}
          color="primary"
          onClick={handleUndo}
        >
          <ArrowBackIosRoundedIcon fontSize="large" />
        </IconButton>
        <IconButton
          disabled={historyStep >= history.length - 1}
          color="primary"
          onClick={handleRedo}
        >
          <ArrowForwardIosRoundedIcon fontSize="large" />
        </IconButton>
        <IconButton disabled={!selectedId} color="primary">
          <QueueRoundedIcon fontSize="large" />
        </IconButton>
        <IconButton disabled={!selectedId} color="primary">
          <DeleteRoundedIcon fontSize="large" />
        </IconButton>
        <IconButton disabled={!selectedId} color="primary">
          <LoopRoundedIcon fontSize="large" />
        </IconButton>
      </Toolbar>
      <Fab
        color="primary"
        aria-label="add"
        style={{ bottom: "115px", left: "300px" }}
        onClick={handleOpen}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
