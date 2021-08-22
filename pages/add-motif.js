import React, { useState, useEffect } from "react";
import reactImageSize from "react-image-size";
import ImageUploading from "react-images-uploading";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import IconButton from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";

import Header from "../components/header.js";
import Footer from "./footer.js";
import ResizeMotif from "./resize-motif";

const useStyles = makeStyles((theme) => ({
  addContainer: {
    backgroundColor: "#660000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "8px",
    marginBottom: "8px",
    textAlign: "center",
    verticalAlign: "top",
    cursor: "pointer",
    transition: "border-color 03s",
  },
  upload: {
    width: "104px",
    height: "104px",
    backgroundColor: "#fafafa",
    border: "1px dashed #d9d9d9",
    borderRadius: "2px",
  },
  update: {
    /* width: 104px', */
    height: "24px",
    backgroundColor: "#fafafa",
    border: "1px dashed #d9d9d9",
    borderRadius: "2px",
  },
  complete: {
    height: "48px",
    color: "#F6F3EC",
    backgroundColor: "#660000",
    borderRadius: "2px",
  },
  text:{
    color : 'white'
  }
}));

export default function Add() {
  const [images, setImages] = React.useState([]);
  const [size, setSize] = React.useState({ height: "30", width: "20" });
  const [isShow, setIsShow] = React.useState(false);
  const classes = useStyles();

  const onChange = (imageList, addUpdateIndex) => {
    // URLを取得して設定
    // console.log(imageList, addUpdateIndex);
    setImages(imageList);
    //大きさ取得して設定すること
    reactImageSize(imageList[0]["data_url"])
      .then(({ width, height }) => {
        // console.log(width, height);
        setSize({ height: height, width: width });
        // console.log(size);
      })
      .catch((errorMessage) => {
        console.log("error");
      });
    //次の画面でstateから取り出せるかどうか
  };

  return (
    <>
      <Header />
      {!isShow && (
        <>
          <div className={classes.addContainer}>
          <p className={classes.text}>パーツ画像を追加してください</p>
            <ImageUploading
              // className={classes.imageUploading}
              multiple
              value={images}
              onChange={onChange}
              maxNumber="1"
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
              }) => (
                // write your building UI
                <div className="upload__image-wrapper">
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <Image src={image["data_url"]} height={100} width={100} alt="" />
                      <div
                        className={`${classes.update} ${classes.button}`}
                        onClick={() => onImageUpdate(index)}
                      >
                        <span>change</span>
                      </div>
                    </div>
                  ))}
                  {imageList.length === 0 && (
                    <div
                      className={`${classes.upload} ${classes.button}`}
                      onClick={onImageUpload}
                    >
                      <span>+</span>
                    </div>
                  )}
                </div>
              )}
            </ImageUploading>
          </div>
            <Footer>
          {images.length != 0 && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  setIsShow(true);
                }}
              >
                <CheckRoundedIcon />
              </IconButton>
          )}
            </Footer>
        </>
      )}
      {isShow && (
        <ResizeMotif
          id=""
          height={size["height"]}
          width={size["width"]}
          src={images[0]["data_url"]}
          tag=""
        />
      )}
    </>
  );
}
