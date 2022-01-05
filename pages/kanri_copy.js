import React, { useState, useEffect, useContext } from "react";
import { db } from "../components/firebase";
import Header from "../components/header.js";

export default function Test() {
  //１　デザイン全部取得
  const [start, setStart] = useState();

  let design = new Map();
  const [json, setJSON] = useState();
  useEffect(() => {
    db.collectionGroup("design")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          design.set(doc.id, doc.data());
        });
        setStart(true);
      });
  });
  //２　IDから特定する
  const [str, setStr] = useState("");

  //３　特定のアカウントにコピーかける
  const [save, setSave] = useState("");

  // const userId = "mZWRiSCmd9Y3G94NbTpTRwGirb72"
  const userId = "sd6oNXWk30NLXezKcXSoyQmEuWj1";
  const copy = () => {
    db.collection("users")
      .doc(userId)
      .collection("design")
      .doc(str + "_tana")
      .set(json)
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
          setJSON(design.get(str));
        }}
      >
        get
      </button>
      {json && "  ok"}
      <br />
      <button
        onClick={() => {
          copy();
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