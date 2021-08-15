import { db } from "./firebase";
import { useState, useEffect } from "react";


export default function Test() {
useEffect(() => {
    const firebaseData = db.collection("series").onSnapshot((snapshot) => {
        // const firebaseData = db.collection("series").docs("IC3cHj3Vew9FUuy84BUg").collection("tag").onSnapshot((snapshot) => {
        // snapshot.docs.map((dbData) => ({
            // id: dbData.id,
        //   height: dbData.data().height,
        // }))
        // console.log(snapshot.docs[0]);
        console.log(snapshot.docs[0].data());
    });
    return () => firebaseData();
}, []);

return <div>DB</div>
}