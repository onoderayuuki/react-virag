// import { getAuth, signInAnonymously } from "firebase/auth";
import { auth } from "../components/firebase";
import { db } from "../components/firebase";
import { useState,createContext } from "react";
import Child from "./test-Child";

export const UserContext = createContext()

export default function Parent() {
    const getCurrentDate=(separator='')=>{
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();      
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }
    const [userID, setUserID] = useState("");
    // const newDate = new Date()
    // console.log(getCurrentDate('/'));

    auth.onAuthStateChanged(async (user) => {
        // 未ログイン時
        if (!user) {
            auth.signInAnonymously()
            .then(() => {
                console.log('create');
            }) 
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode,errorMessage);
            });
        }
        // ログイン時
        else {
            // TODO: useContextに登録？
            console.log('2',user);
            //ここで登録済みかどうかを確認しないといけない
            const firebaseData = db.collection("users")
            .doc(user.uid).get()
            .then((doc) => {
                setUserID(user.uid);
                //初回登録処理
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                } else {
                    db.collection("users").doc(user.uid).set({
                        name: "none",
                        created_at: getCurrentDate('/')
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
            
        }
    });



return (<>
<h1>Parent</h1>
{userID}
<UserContext.Provider value={userID}>
    <Child />
</UserContext.Provider>
</>);
}

