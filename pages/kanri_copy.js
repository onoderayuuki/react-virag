import React, { useState, useEffect, useContext } from "react";
import { db } from "../components/firebase";
import Header from "../components/header.js";
import Image from "next/image";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";

export default function Test() {
  //１　デザイン全部取得
  const [start, setStart] = useState();
  const [design,setDesign] =useState();
  // const [json, setJSON] = useState();
  useEffect(() => {
    db.collectionGroup("design")
      .get()
      .then((querySnapshot) => {
        setDesign(
          querySnapshot.docs.map((dbData) => ({
            key: dbData.id,
            data: dbData.data(),
            src: dbData.data().base64,
          }))
        );
      }
            
      );
      setStart(true);
      console.log(design);
  },[]);
  //２　IDから特定する
  const [str, setStr] = useState("");

  //３　特定のアカウントにコピーかける
  const [save, setSave] = useState("");
  const [json,setJSON] = useState("");

  // const userId = "mZWRiSCmd9Y3G94NbTpTRwGirb72"
  const userId = "sd6oNXWk30NLXezKcXSoyQmEuWj1";
  const copy = (id, key, value) => {
    db.collection("users")
      .doc(userId)
      .collection("design")
      .doc(key + "_tana" + id)
      .set(value)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef);
        setSave(" ok!");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  //自分のを表示
  const [canvasImages, setCanvasImages] = useState([]);
  const getMe = () => {
    db.collection("users").doc(userId).collection("design").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      console.log("Mysnapshot.docs:", snapshot.docs);
      if (snapshot.docs) {
        setCanvasImages(
          snapshot.docs.map((dbData) => ({
            key: dbData.id,
            src: dbData.data().base64,
          }))
        );
      }
    });
  }
  //画像表示
  const ImageListBox = ({ itemList }) => {
    return (
        <ImageList cols={2.5}>
          {itemList != null &&
            itemList.map((item) => (
              <ImageListItem key={item.id}>
               
                  <Image src={item.src} alt="#" height="180px" width="135px" />
                  <ImageListItemBar
                          subtitle={item.key} />
              </ImageListItem>
            ))}
        </ImageList>
    );
  };
  
  return (
    <>
      <Header />
      <h1>all_Design</h1>
      <ImageListBox
          itemList={design}
          ></ImageListBox>
      <h1>Copy_Design</h1>
      {start && (
        <>
          <input
            type="text"
            size={40}
            value={str}
            onChange={(event) => setStr(event.target.value)}
          />
          {str && "  ok"}
          <br />
          <button
            onClick={() => {
              const tmp = design.filter((value) => value.key == str);
              setJSON(tmp);
              console.log(json);
            }}
          >
            get
          </button>
          {json && "  ok"}
          {json &&   <ImageListBox itemList={json}/>}
          <br />
          <button
            onClick={() => {
              for (let i = 0; i < json.length; i++) {
                console.log(i, json[i].key, json[i].data);
                copy(i, json[i].key, json[i].data);
              }
            }}
          >
            copy
          </button>
          {save}
          <br />
          <button
            onClick={() => {
             getMe(); 
            }}
          >
            check
          </button>
          {save&& <ImageListBox itemList={canvasImages}/>}
        </>
      )}
    </>
  );
}
