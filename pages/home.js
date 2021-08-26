import React, { useState, useEffect,useContext } from "react";

import Link from "next/link";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/Button";
import CropOriginalRoundedIcon from "@material-ui/icons/CropOriginalRounded";
import ListRoundedIcon from '@material-ui/icons/ListRounded';
import PhotoAlbumRoundedIcon from '@material-ui/icons/PhotoAlbumRounded';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Button from "@material-ui/core/Button";

import Box from '@material-ui/core/Box';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';

import Header from "../components/header.js";

import { db } from "../components/firebase";
import { UserContext } from "./_app.js";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  homeContainer:{
    // height:'90vh',
    backgroundColor:theme.palette.secondary.light,
    // color:theme.palette.secondary.contrastText
  },
  link: {
    display:'flexed',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  box:{
    padding:'10px'
    
  }
}));

export default function Home() {
  const classes = useStyles();
  const [plusBox,setPlusBox] = useState({ id:"new" ,src:"/plusbox.png"});
  const [canvasImages, setCanvasImages] = useState([]);
  // const [canvasImages, setcanvasImages] = useState([
  //   { id: "1", src: "/canvas-image.png"},
  //   { id: "2", src: "/canvas-image.png"},
  //   { id: "3", src: "/canvas-image.png"},
  //   { id: "4", src: "/canvas-image.png"},
  // ]);

  // const userId = "ZZeI9mOadD7wxmT26dqB";
  const userId = useContext(UserContext);
  
  useEffect(() => {
    console.log(userId);
    if(userId){
      const firebaseData = db.collection("users")
      .doc(userId)
      .collection("design")
      .onSnapshot((snapshot) => {
        console.log("snapshot.docs:",snapshot.docs);
        if(snapshot.docs){
          setCanvasImages(
              snapshot.docs.map((dbData) => ({
                  id: dbData.id,
                  src: dbData.data().base64,
                }))
              );
        }
              
      });
      return () => firebaseData();
    }
  }, []);


  const ImageListBox = ({title,itemList}) =>{
    return(
      <Box className={classes.box}>
      <p>{title}</p>
        <ImageList className={classes.imageList} cols={2.5}>
        {itemList !=null && itemList.map((item) => (
          <ImageListItem key={item.id}>
            {/* TODO:ドキュメントIDの表示、登録日付表示 */}
            <Link href={{
               pathname: "/canvas",
               query: { designId: item.id },
              }} passHref>
              <Image src={item.src} alt="#" height="200px" width="150px"/>
            </Link>
            {item.id>0 && 
            <ImageListItemBar
              title="準備中：押せません"
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={
                <IconButton aria-label={`star ${item.title}`}>
                  <StarBorderIcon className={classes.title} />
                </IconButton>
              }
            />
          }
          </ImageListItem>
        ))}
      </ImageList>
      </Box>
    );
  }
  return (
    <>
      <Header>
      <Button color="inherit">
          <Link href={"/login"}>Login</Link>
        </Button>
      </Header>

      <div className={classes.homeContainer}>
      <ImageListBox  title="公開されているデザイン" itemList={canvasImages}></ImageListBox>
      <ImageListBox title="あなたのデザイン" itemList={[plusBox,...canvasImages]}></ImageListBox>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="add"
      >
        <Link href={"/add-motif"} passHref>
          <div className={classes.link}>
            <p>モチーフを追加</p>
            <CropOriginalRoundedIcon fontSize="large"/>
          </div>
        </Link>
      </IconButton>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="list"
      >
        <Link href={"/list-motifs"} passHref>
          <div className={classes.link}>
            <p>モチーフ一覧</p>
            <ListRoundedIcon fontSize="large"/>
          </div>
        </Link>
      </IconButton>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="list"
      >
        <Link href={"/package-motifs"} passHref>
          <div className={classes.link}>
            <p>シリーズ管理</p>
            <PhotoAlbumRoundedIcon fontSize="large"/>
          </div>
        </Link>
      </IconButton>
      </div>
    </>
  );
}
