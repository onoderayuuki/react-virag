import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import Image from "next/image";

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useState} from "react";

export const DndBox = ({ id, height, width, trueHeight, trueWidth, src, onChange,deleteMotif }) => {
  const style = {
    marginRight: "1.5rem",
    marginBottom: "1.5rem",
    cursor: "move",
    height: height,
    width: width,
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.BOX,
    item: { id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
        console.log("item", item);
        console.log("dropResult", dropResult);
      if(dropResult != null){
        onChange(item,dropResult.name);
      }else{
        onChange(item,"");
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));
  
  const opacity = isDragging ? 0.4 : 1;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (el) => {
    // console.log("click");
    setAnchorEl(el);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      {/* <DragPreviewImage connect={preview} src={src} /> */}
      <div
        ref={drag}
        role="Box"
        style={{ ...style, opacity }}
        data-testid={`box-${id}`}
        onClick={(e)=>{handleClick(e.currentTarget);}}
      >
        <Image 
        src={src} 
        alt="Motif Image" 
        width={width}
        height={height}
        // width={width < 30 ? width* 72/ 25.4 : 90} 
        // height={width < 30 ? height* 72/ 25.4 : height/width*90} 
        />
      </div>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem >{trueHeight}*{trueWidth}</MenuItem>
        <MenuItem onClick={()=>{deleteMotif(id)}}>削除</MenuItem>
        {/* <MenuItem>サイズ変更</MenuItem> */}
      </Menu>

    </>
  );
  
};
