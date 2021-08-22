import React, { useState, useEffect } from "react";
import { db } from "../components/firebase";
import Image from "next/image";

import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import IconButton from '@material-ui/core/Button';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import HeightRoundedIcon from '@material-ui/icons/HeightRounded';

import ResizeMotif from './resize-motif'
import Header from "../components/header.js";
import Footer from "./footer.js";

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: '#660000'
    // theme.palette.background.paper,
  },
  imageList: {
    width: '100%',
  },
  list_container :{
    backgroundColor: '#660000',
    position: 'relative',
    paddingBottom: '50px',
    boxSizing: 'border-box',
    height: '80vh',
    /* display: flex, */
  },
  select :{
      border: 'solid 10px #F6F3EC',
      /* height:80%; */
  }
});

export default function ListMotifs() {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  const [isShow, setIsShow] = React.useState(false);
  const [motifs, setMotifs] = useState([
    {
      id: "",
      height: "",
      width: "",
      src: "",
    },
  ]);

  const [selectMotifId, setSelectMotifId] = useState('-1');
  
  const handleClick = (id) => {
    setSelectMotifId(parseInt(id));
    console.log(selectMotifId);
  };
  const deleteMotif =(id)=>{
    db.collection("motif").doc(id).delete().then(() => {
      console.log("firestore:Document successfully deleted!");
  }).catch((error) => {
      console.error("firestore:Error removing document: ", error);
  });
  }

  // console.log(firebaseApp);
  useEffect(() => {
    const firebaseData = db.collection("motif").onSnapshot((snapshot) => {
      setMotifs(
        snapshot.docs.map((dbData) => ({
          id: dbData.id,
          height: dbData.data().height,
          width: dbData.data().width,
          src: dbData.data().src,
        }))
      );
      console.log(snapshot.docs);
    });
    return () => firebaseData();
  }, []);
  return (
    <>
      <Header />
      {!isShow && 
      <>
      <div className={classes.list_container}>
      {/* list */}
        <div className={classes.root}>
          <ImageList rowHeight={200} className={classes.imageList} cols={2}>
          {motifs.map((motif,index) => (
            <ImageListItem 
              key={motif.id} 
              cols={motif.cols || 1}
              id = {index}
              onClick={() => handleClick(index)}
              className={index == selectMotifId ? classes.select : ""}
            >
              {motif.src != "" && (
                <Image
                src={motif.src}
                alt="Motif Image"
                height={(motif.height * 72) / 25.4}
                width={(motif.width * 72) / 25.4}
                />
                )}
              </ImageListItem>
            ))}
        </ImageList>
        </div>
          </div>
        {/* footer */}
        <Footer>        
        {selectMotifId != "-1" && <>  
          <IconButton 
            edge="start"  
            color="inherit" 
            aria-label="trash" 
            onClick={()=>{deleteMotif(motifs[selectMotifId]['id'])}}
          >
            <DeleteRoundedIcon />
          </IconButton>
          <IconButton 
            edge="start"  
            color="inherit" 
            aria-label="trash" 
            onClick={()=>{setIsShow(true)}}>
            <HeightRoundedIcon />
          </IconButton>
          <span>{motifs[selectMotifId]['height']}*{motifs[selectMotifId]['width']}</span>
          </>}
        </Footer>
        </>
      }
      {isShow && 
        <ResizeMotif 
          id={motifs[selectMotifId]['id']}
          height={motifs[selectMotifId]['height']} 
          width={motifs[selectMotifId]['width']} 
          src={motifs[selectMotifId]['src']}
        />
      }
    </>
  );
}
