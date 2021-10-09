import { useState, useEffect ,useContext} from "react";

import Grid from "@material-ui/core/Grid";
import { IconButton,Box } from "@material-ui/core";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import { Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import Typography from "@material-ui/core/Typography";

// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { TouchBackend } from "react-dnd-touch-backend";

// import { DndProvider } from 'react-dnd-multi-backend'
// import { HTML5toTouch } from 'rdndmb-html5-to-touch'

import { Dustbin } from "../components/Dustbin";
import { DndBox } from "../components/DndBox";

import Header from "../components/header.js";

import { db } from "../components/firebase";
import { UserContext } from "./_app";

import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import { DndProvider, TouchTransition, MouseTransition } from 'react-dnd-multi-backend'

export const HTML5toTouch = {
  backends: [
    {
      id: 'html5',
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: 'touch',
      backend: TouchBackend,
      options: {enableMouseEvents: true},
      preview: true,
      transition: TouchTransition,
    },
  ],
}

export default function Package() {
  // const [seriesTitle, setSeriesTitle] = useState("untitle-test");
  // const [tagNames, setTagNames] = useState(["tag0", "tag1", "tag2"]);
  // const [motifs, setMotifs] = useState([
  //   { id: "aaaa", height: "50", width: "50", src: "/test.png", tag: "tag1" },
  //   { id: "bbbb", height: "50", width: "50", src: "/test2.png", tag: "tag2" },
  //   { id: "cccc", height: "100", width: "100", src: "/test3.png", tag: "" },
  //   { id: "dddd", height: "100", width: "100", src: "/test2.png", tag: "" },
  // ]);
  const [seriesTitle, setSeriesTitle] = useState("シリーズ名");
  const [tagNames, setTagNames] = useState(["背景","タグ名"]);
  const [motifs, setMotifs] = useState([]);
  // const [seriesID, setSeriesID] = useState();

    // const userId = "ZZeI9mOadD7wxmT26dqB";
    const userId = useContext(UserContext);

  //データ取得
  useEffect(() => {
    if(userId){
      const MotifRef = db.collection("users").doc(userId).collection("motif");
      const SeriesRef = db.collection("users").doc(userId).collection("series");
      const seriesID = userId;
      // setSeriesID(userId);

      console.log('seriesID:',seriesID);

      SeriesRef.doc(seriesID).get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setSeriesTitle(doc.data().title);
          setTagNames(doc.data().tagNames);
        } else {
            //TODO: Seriesの中身追加が必要
            console.log("No such document!");
            SeriesRef.doc(seriesID).set({
              title: seriesTitle,
              tagNames: tagNames,
            }).then(()=>{
              console.log("series1 create");
            }).catch((error) =>{
              console.error("Error writing document: ", error);
            });
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
    }
  }, []);
  

  //保存
  const saveDB = () => {
    console.log("save: ");
    
    const SeriesRef = db.collection("users").doc(userId).collection("series");
    // const seriesID = "series1";
    const seriesID = userId;

    SeriesRef.doc(seriesID).set({
      title: seriesTitle,
      tagNames: tagNames,
    });

    const MotifRef = db.collection("users").doc(userId).collection("motif");
    motifs.map((motif)=>{
      MotifRef.doc(motif.id).update({
        "series":seriesTitle,
        "tag": motif.tag
      })
      .then(() => {
        console.log("Document successfully updated!");
      });
    })
    handleClick();
  };
  //保存メッセージ
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  // 変更
  const changeTagName = (index, newName) => {
    const newTags = tagNames.slice();
    newTags[index] = newName;

    const newMotifs = motifs.slice();
    newMotifs.map((motif, i) => {
      if (motif.tag === tagNames[index]) {
        newMotifs[i] = {
          ...motif,
          tag: newName,
        };
      }
    });
    setTagNames(newTags);
    setMotifs(newMotifs);
  };

  const changeTag = (item, Tagname) => {
    const index = motifs.findIndex((value) => value.id == item.id);
    const newMotifs = motifs.slice();
    const newMotif = motifs[index];
    newMotifs[index] = {
      ...newMotif,
      tag: Tagname,
    };
    setMotifs(newMotifs);
  };

  // const Container = () => {
  const Boxes = function Box({ tag }) {
    let tagMotifs = motifs;
    if (tag != null) {
      tagMotifs = motifs.filter(function (motif) {
        return motif.tag == tag;
      });
    }
    return (
      <>
        {tagMotifs.map((motif, i) => (
          <DndBox
            key={motif.id}
            id={motif.id}
            // alt={motif.id}
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


  return (
    <>
      <Header>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
          Virag
        </Typography>
        <IconButton color="primary" onClick={saveDB}>
          <SaveRoundedIcon fontSize="large" />
        </IconButton>
      </Header>
      {/* <DndProvider backend={TouchBackend}> */}
      <DndProvider options={HTML5toTouch}>
      <Grid container spacing={0}>
          <Grid item xs={3}>
            <Boxes tag="" />
          </Grid>
          <Grid
            item
            xs={9}
            style={{ backgroundColor: "#660000", height: "100vh" }}
          >
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
            <Box
              style={{color: "#660000",
              margin: "10px",
              border: "solid 2px #660000",
              backgroundColor:'#F6F3EC'}}
              >
              <IconButton 
                // className={classes.materialBox}
              onClick={()=>{setTagNames([...tagNames,"newTag"+tagNames.length])}}>
                <AddRoundedIcon />
                {/* <p>タグを追加</p> */}
              </IconButton>
            </Box>
          </Grid>
        </Grid>      
        </DndProvider>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="保存しました"
          action={
            <>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
        }
      />
    </>
  );
}
