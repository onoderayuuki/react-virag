import React, { useState, useEffect, useContext } from "react";
import { db } from "../components/firebase";
import Header from "../components/header.js";

export default function Test() {
  //１　デザイン全部取得
  const [start, setStart] = useState();
  let temp = [];
  let design = [];
  // const [json, setJSON] = useState();
  useEffect(() => {
    db.collectionGroup("design")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id);
          // temp.push(doc.id);
          design.push({key:doc.id ,data:doc.data()});
        });
        setStart(true);
        console.log(design);
      });
  });
  //２　IDから特定する
  const [str, setStr] = useState("");

  //３　特定のアカウントにコピーかける
  const [save, setSave] = useState("");
  let json ="";

  // const userId = "mZWRiSCmd9Y3G94NbTpTRwGirb72"
  const userId = "sd6oNXWk30NLXezKcXSoyQmEuWj1";
  const copy = (id,key,value) => {
    db.collection("users")
      .doc(userId)
      .collection("design")
      .doc( key+ "_tana" + id)
      .set(value)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef);
        setSave(" ok!");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  return (
    <>
      <Header />
      <h1>Copy_Design</h1>
      {temp}
    {start &&
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
          json = design.filter(value => value.key == str);
          console.log(json);
        }}
      >
        get
      </button>
      {json && "  ok"}
      <br />
      <button
        onClick={() => {

          for (let i=0; i < json.length; i++) {
            console.log(i,json[i].key,json[i].data);
            copy(i,json[i].key,json[i].data);
          }
        }}
      >
        copy
      </button>
      {save}
    </>
    }
      </>
  );
}