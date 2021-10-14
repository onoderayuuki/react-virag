import Router from "next/router";
import { useBeforeUnload } from "react-use";
import Header from "../components/header.js";
import { useState, useEffect ,useContext} from "react";

export default function useLeavePageConfirm  (
) {

//     const [isConfirm,setIsConfirm] = useState(true);
//     useBeforeUnload(isConfirm, "Are you sure want to leave this page?");

//   useEffect(() => {
//     const handler = () => {
//       if (isConfirm && !window.confirm("Are you sure want to leave this page?")) {
//         throw "Route Canceled";
//       }
//     };
//     Router.events.on("routeChangeStart", handler);
//   }, [isConfirm]);
//   return <>
//     <Header />
//     テストページ
//   </>


const [dirty, toggleDirty] = useState(false);
useBeforeUnload(dirty, 'You have unsaved changes, are you sure?');

return (
  <div>
    {dirty && <p>Try to reload or close tab</p>}
    <button onClick={() => toggleDirty(true)}>{dirty ? 'Disable' : 'Enable'}</button>
  </div>
);


};