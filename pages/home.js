import React, { useState, useEffect, useContext } from "react";

import Link from "next/link";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/Button";
import CropOriginalRoundedIcon from "@material-ui/icons/CropOriginalRounded";
import ListRoundedIcon from "@material-ui/icons/ListRounded";
import PhotoAlbumRoundedIcon from "@material-ui/icons/PhotoAlbumRounded";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import Button from "@material-ui/core/Button";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import Box from "@material-ui/core/Box";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import Typography from "@material-ui/core/Typography";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Header from "../components/header.js";

import { db } from "../components/firebase";
import { UserContext } from "./_app";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  homeContainer: {
    height: "90vh",
    // backgroundColor: theme.palette.secondary.light,
    backgroundColor: "#F6F3EC",
    color:"#660000"
  },
  link: {
    display: "flexed",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: theme.palette.primary.dark,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 0%)",
    top: "-10px",
    left: "70px",
  },
  actionIcon: {},
  box: {
    padding: "10px",
  },
}));

export default function Home() {
  const classes = useStyles();
  const [plusBox, setPlusBox] = useState({ id: "new", src: "/plusbox.png" });
  const [canvasImages, setCanvasImages] = useState([]);
  const [openImages, setOpenImages] = useState([]);
  // const [canvasImages, setcanvasImages] = useState([
  //   { id: "1", src: "/canvas-image.png"},
  //   { id: "2", src: "/canvas-image.png"},
  //   { id: "3", src: "/canvas-image.png"},
  //   { id: "4", src: "/canvas-image.png"},
  // ]);

  // const userId = "ZZeI9mOadD7wxmT26dqB";
  const userId = useContext(UserContext);

  useEffect(() => {
    console.log("homeのuserID確認", userId);
    if (userId) {
      // const firebaseData = 
      db.collection("users").doc(userId).collection("design").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
          console.log("Mysnapshot.docs:", snapshot.docs);
          if (snapshot.docs) {
            setCanvasImages(
              snapshot.docs.map((dbData) => ({
                id: dbData.id,
                src: dbData.data().base64,
              }))
            );
          }
        });
        db.collection("design").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
          console.log("Opensnapshot.docs:", snapshot.docs);
          if (snapshot.docs) {
            setOpenImages(
              snapshot.docs.map((dbData) => ({
                id: dbData.id,
                src: dbData.data().base64,
              }))
            );
          }
        });
      // return () => firebaseData();
    }
  }, [userId]);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [canvasID, setCanvasId] = useState("");
  const deleteDesign = () => {
    if (canvasID) {
      const MotifRef = db
        .collection("users")
        .doc(userId)
        .collection("design")
        .doc(canvasID)
        .delete()
        .then(() => {
          console.log("firestore:Document successfully deleted!", canvasID);
        })
        .catch((error) => {
          console.error("firestore:Error removing document: ", error);
        });
    }
  };

  const ImageListBox = ({ title, itemList, closeButton }) => {
    return (
      <Box className={classes.box}>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <ImageList className={classes.imageList} cols={2.5}>
          {itemList != null &&
            itemList.map((item) => (
              <ImageListItem key={item.id}>
                {/* TODO:ドキュメントIDの表示、登録日付表示 */}
                <Link
                  href={{
                    pathname: "/canvas",
                    query: { designId: item.id },
                  }}
                  passHref
                >
                  <Image src={item.src} alt={item.id} height="180px" width="135px" />
                </Link>
                {closeButton && item.id != "new" && (
                  <ImageListItemBar
                    title={item.id}
                    classes={{
                      root: classes.titleBar,
                      title: classes.title,
                      actionIcon: classes.actionIcon,
                    }}
                    position="top"
                    actionIcon={
                      <IconButton
                        onClick={() => {
                          console.log(item);
                          setCanvasId(item.id);
                          handleClickOpen();
                        }}
                      >
                        <CancelRoundedIcon className={classes.title} />
                      </IconButton>
                    }
                  />
                )}
              </ImageListItem>
            ))}
        </ImageList>
      </Box>
    );
  };
  return (
    <>
      <Header>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Virag
        </Typography>
        <Button color="inherit">
          <Link href={"/login"} passHref>
            <AccountCircleRoundedIcon />
          </Link>
        </Button>
      </Header>

      <Box className={classes.homeContainer} pt={3}>
        <ImageListBox
          title="公開されているデザイン"
          itemList={openImages}
        ></ImageListBox>

        <ImageListBox
          title="あなたのデザイン"
          itemList={[plusBox, ...canvasImages]}
          closeButton={true}
        ></ImageListBox>

        {/* 削除ダイアログ */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"確認"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              デザインを削除してよいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setCanvasId("");
                handleClose();
              }}
              color="primary"
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                deleteDesign();
                handleClose();
              }}
              color="primary"
              autoFocus
            >
              はい
            </Button>
          </DialogActions>
        </Dialog>

        {/* モチーフ部分 */}
        <Box className={classes.box} mt={8}>
          <Typography variant="subtitle2" gutterBottom>
            モチーフ
          </Typography>
          <Box>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="add"
            >
              <Link href={"/add-motif"} passHref>
                <div className={classes.link}>
                  <CropOriginalRoundedIcon fontSize="large" />
                  <p>追加</p>
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
                  <ListRoundedIcon fontSize="large" />
                  <p>一覧</p>
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
                  <PhotoAlbumRoundedIcon fontSize="large" />
                  <p>管理</p>
                </div>
              </Link>
            </IconButton>
          </Box>
        </Box>
      </Box>
    </>
  );
}
