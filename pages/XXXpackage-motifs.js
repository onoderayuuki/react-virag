import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import Image from "next/image";
import Header from "./header.js";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Package() {
  const ItemTypes = {
    Motif: "motif",
  };
  const isDragging = false;
  // const [{ isDragging }, drag] = useDrag(() => ({
  //   type: ItemTypes.KNIGHT,
  //   drag: () => console.log('drag'),
  //   collect: (monitor) => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  // }));

  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: ItemTypes.KNIGHT,
  //   drop: () => console.log('drop'),
  //   collect: monitor => ({
  //     isOver: !!monitor.isOver(),
  //   }),
  // }), [x, y])

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div style={{ border: "solid 2px black" }}>
          パーツ
          <div
            // ref={drag}
            style={{
              opacity: isDragging ? 0.5 : 1,
              cursor: "move",
            }}
          >
            <Image
              src="/test.png"
              alt="Motif Image"
              height="100px"
              width="100px"
            />
          </div>
        </div>
        <div style={{ border: "solid 2px red" }}>
          パッケージ
          <div 
          // ref={drop} 
          style={{ backgroundColor: "yellow" }}>
            タグ
          </div>
          <div 
          // ref={drop} 
          style={{ backgroundColor: "green" }}>
            タグ
          </div>
          <div 
          // ref={drop} 
          style={{ backgroundColor: "pink" }}>
            タグ
          </div>
        </div>
      </DndProvider>
    </>
  );
}
