import  { useContext } from "react";
import { UserContext } from "./test";

const Child = () => {
    const userID = useContext(UserContext)
  return (
    <>
      <h2>Childです</h2>
      <p>{userID}</p>
    </>
  );
};
export default Child;