import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import { IconButton } from "@material-ui/core";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import { Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AddIcon } from "@material-ui/icons/Add";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { Dustbin } from "../components/Dustbin";
import { Box } from "../components/DndBox";

import Header from "../components/header.js";

import { db } from "../components/firebase";


const useStyles = makeStyles((theme) => ({
  materialBox: {
    // height: "100px",
    // width: '80vw',
    color: "#660000",
    margin: "10px",
    border: "solid 2px #660000",
    backgroundColor:'#F6F3EC'
  },
}));

export default function Package() {
  const [seriesTitle, setSeriesTitle] = useState("untitle-test");
  const [tagNames, setTagNames] = useState(["tag0", "tag1", "tag2"]);
  const [motifs, setMotifs] = useState([
    { id: "aaaa", height: "50", width: "50", src: "/test.png", tag: "tag1" },
    { id: "bbbb", height: "50", width: "50", src: "/test2.png", tag: "tag2" },
    { id: "cccc", height: "100", width: "100", src: "/test3.png", tag: "" },
    { id: "dddd", height: "100", width: "100", src: "/test2.png", tag: "" },
  ]);

  //データ取得
  const seriesID = "IC3cHj3Vew9FUuy84BUg";
  const SeriesRef = db.collection("series").doc(seriesID);
  const MotifRef = db.collection("motif");
  useEffect(() => {
    SeriesRef.get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setSeriesTitle(doc.data().title);
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
      console.log(snapshot.docs);
    });
    return () => MotifData();
  }, []);
  
  //保存
  const saveDB = () => {
    console.log("save: ");
    SeriesRef.set({
      title: seriesTitle,
      tagNames: tagNames,
    });
    motifs.map((motif)=>{
      MotifRef.doc(motif.id).update({
        "series":seriesTitle,
        "tag": motif.tag
      })
      .then(() => {
        console.log("Document successfully updated!");
      });
    })
  };
  
  // 変更
  const changeTagName=(index,newName)=>{
    const newTags = tagNames.slice();
    newTags[index] = newName;

    const newMotifs = motifs.slice();
    newMotifs.map((motif,i)=>{
      if(motif.tag===tagNames[index]){
        newMotifs[i] = {
          ...motif,
          tag: newName,
        };
      }
    })
    setTagNames(newTags);
    setMotifs(newMotifs);
  }

  const changeTag=(item, Tagname)=>{
    const index = motifs.findIndex((value) => value.id == item.id);
    const newMotifs = motifs.slice();
    const newMotif = motifs[index];
    newMotifs[index] = {
      ...newMotif,
      tag: Tagname,
    };
    setMotifs(newMotifs);
  }

  const Container = () => {
    // const test = () => {
    //   console.log("test");
    //   const newMotifs = motifs.slice();
    //   newMotifs[4] = {
    //     id: "4",
    //     height: "50",
    //     width: "50",
    //     src: "/test3.png",
    //     tag: "tag1",
    //   };
    //   setMotifs(newMotifs);
    // };

    const Boxes = function Box({ tag }){
      let tagMotifs = motifs;
      if (tag != null) {
        tagMotifs = motifs.filter(function (motif) {
          return motif.tag == tag;
        });
      }
      return (
        <>
          {tagMotifs.map((motif, i) => (
            <Box
              key={motif.id}
              id={motif.id}
              height={100}
              width={100}
              src={motif.src}
              onChange={(item, dropResult) => {
                changeTag(item, dropResult);
              }}
            />
          ))}
        </>
      );
    };

    const classes = useStyles();

    return (
      <>
        <Header>
          <IconButton color="primary" onClick={saveDB}>
            <SaveRoundedIcon fontSize="large" />
          </IconButton>
        </Header>
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Boxes tag="" />
          </Grid>
          <Grid
            item
            xs={9}
            style={{ backgroundColor: "#660000", height: "100%" }}
          >
            {/* <h1 style={{ color: "white", paddingLeft: "10px" }}>
              {seriesTitle}
            </h1> */}
            <Input
              color="secondary"
              style={{ color: "white", fontSize: "25px", paddingLeft: "10px" }}
              defaultValue={seriesTitle}
              onBlur={(e) => {
                console.log(e.target.value);
                setSeriesTitle(e.target.value);
              }}
            />

            {tagNames.map((tag, i) => (
              <Dustbin
                key={tag}
                name={tag}
                onChange={(newName) => {
                  changeTagName(i,newName);
                }}
              >
                <Boxes tag={tag} />
              </Dustbin>
            ))}
            <div
              // style={{height:100 ,backgroundColor:"#F6F3EC"}}
              >
              <IconButton 
                className={classes.materialBox}
              // edge="start"  
              // color="inherit" 
              // aria-label="trash" 
              onClick={()=>{setTagNames([...tagNames,"newTag"+tagNames.length])}}>
                <AddIcon />
                {/* <p>タグを追加</p> */}
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <>
      {/* Examples */}
      <DndProvider backend={TouchBackend}>
        <Container />
      </DndProvider>
    </>
  );
}
