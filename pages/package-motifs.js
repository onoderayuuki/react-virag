import { useState, useEffect ,useContext} from "react";

import Router from "next/router";
import { useBeforeUnload } from "react-use";

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

// import Header from "../components/header.js";
import Header2 from "../components/header2.js";

import { db } from "../components/firebase";
import { UserContext } from "./_app";

import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'

import { DndProvider, TouchTransition, MouseTransition } from 'react-dnd-multi-backend'

import HomeRoundedIcon from "@material-ui/icons/HomeRounded";

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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

  // const ctx = useContext(ChangeContext);
  // console.log("flg",ctx);
    // Context?????????


  // const [seriesTitle, setSeriesTitle] = useState("untitle-test");
  // const [tagNames, setTagNames] = useState(["tag0", "tag1", "tag2"]);
  // const [motifs, setMotifs] = useState([
  //   { id: "aaaa", height: "50", width: "50", src: "/test.png", tag: "tag1" },
  //   { id: "bbbb", height: "50", width: "50", src: "/test2.png", tag: "tag2" },
  //   { id: "cccc", height: "100", width: "100", src: "/test3.png", tag: "" },
  //   { id: "dddd", height: "100", width: "100", src: "/test2.png", tag: "" },
  // ]);
  const [seriesTitle, setSeriesTitle] = useState("???????????????");
  const [tagNames, setTagNames] = useState(["??????","?????????"]);
  const [motifs, setMotifs] = useState([]);
  // const [seriesID, setSeriesID] = useState();

    // const userId = "ZZeI9mOadD7wxmT26dqB";
    const userId = useContext(UserContext);

  //?????????????????????????????????
    const [isConfirm,setIsConfirm] = useState(false);
    const [leaveOpen,setleaveOpen] = useState(false);
    

    //???????????????
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
            //TODO: Series????????????????????????
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
            height: (dbData.data().width < 30 ? dbData.data().height* 72/ 25.4 : dbData.data().height/dbData.data().width*90),
            width: (dbData.data().width < 30 ? dbData.data().width* 72/ 25.4 : 90),
            src: dbData.data().src,
            tag: dbData.data().tag,
            trueHeight:dbData.data().height,
            trueWidth:dbData.data().width,
          }))
        );
        console.log(snapshot.docs);
      });
      return () => MotifData();
    }
  }, []);
  

  //??????
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
  
  //?????????????????????
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsConfirm(false);
    setOpen(false);
  };

  // ??????
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
    setIsConfirm(true);
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
    setIsConfirm(true);
  };

  const deleteMotif = (id)=>{
    const MotifRef = db.collection("users").doc(userId).collection("motif");
    MotifRef.doc(id).delete().then(() => {
      console.log("firestore:Document successfully deleted!",id);
  }).catch((error) => {
      console.error("firestore:Error removing document: ", error);
  });
  }

  // ???????????????????????????????????????????????????
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
            height={motif.height}
            width={motif.width}
            trueHeight={Math.ceil(motif.trueHeight)}
            trueWidth={Math.ceil(motif.trueWidth)}
            src={motif.src}
            deleteMotif={(id)=>{deleteMotif(id);}}
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
      <Header2>
      <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={()=>{ isConfirm?setleaveOpen(true) : window.location.href='/' }}
        >
            <HomeRoundedIcon  fontSize="large" />
        </IconButton>
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        Vir??g
      </Typography>
        <IconButton color="primary" onClick={saveDB}>
          <SaveRoundedIcon fontSize="large" />
        </IconButton>
      </Header2>
        
      {/* <DndProvider backend={TouchBackend}> */}
      <DndProvider options={HTML5toTouch}>
      <Grid container spacing={0}>
          
          <Grid item xs={3} style={{maxHeight: "100vh", overflow: 'auto'}}>
            <Boxes tag="" />
          </Grid>
          
          <Grid
            item
            xs={9}
            style={{ backgroundColor: "#660000", maxHeight: "100vh", overflow: 'auto' }}
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
                {/* <p>???????????????</p> */}
              </IconButton>
            </Box>
          </Grid>
        </Grid>      
        </DndProvider>

      {/* ????????????????????? */}
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message="??????????????????"
          action={
            <>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
        }
      />

      {/* ?????????????????????????????? */}
      <Dialog
        open={leaveOpen}
        onClose={()=>{setleaveOpen(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"??????"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ??????????????????????????????<br/> ??????????????????????????????????????????????????????????????????????????????????????????????
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setleaveOpen(false)}} color="primary" autoFocus>
            ???????????????
          </Button>
          <Button onClick={()=>{window.location.href='/'}} color="primary">
            ??????
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
