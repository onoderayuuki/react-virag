import { useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  outer: {
    height: "12rem",
    // width: '80vw',
    color: "#660000",
    margin: "10px",
    border: "solid 2px #660000",
  },
  inner: {
    display: "flex",
  },
}));

export const Dustbin = ({ name, children, onChange }) => {
  const classes = useStyles();
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.BOX,
    drop: () => ({ name }),
    // drop: ()=>onChange(),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  //色
  let backgroundColor = "#F6F3EC";
  if (isActive) {
    backgroundColor = "#660000";
  } else if (canDrop) {
    backgroundColor = "white";
  }

  return (
    <Box
      className={classes.outer}
      ref={drop}
      role={"Dustbin"}
      style={{ backgroundColor }}
    >
      <TextField required id="standard-basic" defaultValue={name} onBlur={(e)=>{onChange(e.target.value)}}/>
      <Box className={classes.inner}>{children}</Box>
    </Box>
  );
};
