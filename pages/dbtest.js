// import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { db } from "./firebase";
import firebase from "firebase/app";

import Header from "./header.js";

export default function Canvas() {
  const [tags, setTags] = useState([]);    
  const [tagNames, setTagNames] = useState(["tag0", "tag1", "tag2"]);
    const [motifs, setMotifs] = useState([
      { id: "aaaa", height: "50", width: "50", src: "/test.png", tag: "tag1" },
      { id: "bbbb", height: "50", width: "50", src: "/test2.png", tag: "tag2" },
      { id: "cccc", height: "100", width: "100", src: "/test3.png", tag: "" },
      { id: "dddd", height: "100", width: "100", src: "/test2.png", tag: "" },
    ]);

    const seriesID = "IC3cHj3Vew9FUuy84BUg";
    const SeriesRef = db.collection("series").doc(seriesID);
    const MotifRef = db.collection("motif");

    useEffect(() => {
      SeriesRef.get()
        .then((doc) => {
          if (doc.exists) {
            // console.log("Document data:", doc.data());
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
        let test = [];
        tagNames.map((tagName)=>{
            const thisMotifs =  motifs.filter(function(motif) {
                return motif.tag == tagName;
            })
            test.push({name: tagName,onoff: true,motifs:thisMotifs});
            // setTags([...tags,{name: tagName,onoff: true,motifs:thisMotifs}])
            // console.log([...tags,{name: tagName,onoff: true}]);
            // console.log({name: tagName ,onoff: true ,motifs:thisMotifs});
        })
        setTags(test);
      });
      return () => MotifData();

    }, []);
    
return (
    <>
      <Header />
      {tags.map((tag)=>(
          <div>{tag.name}</div>
      ))}
    </>
  )
}