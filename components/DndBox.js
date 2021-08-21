import { useDrag } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import Image from "next/image";

export const DndBox = ({ id, height, width, src, onChange }) => {
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
  return (
    <>
      {/* <DragPreviewImage connect={preview} src={src} /> */}
      <div
        ref={drag}
        role="Box"
        style={{ ...style, opacity }}
        data-testid={`box-${id}`}
      >
        <Image 
        src={src} 
        alt="Motif Image" 
        height={height* 72/ 25.4} 
        width={width* 72/ 25.4} 
        />
      </div>
    </>
  );
  
};
