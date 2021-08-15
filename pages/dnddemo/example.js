import React, { useState, useEffect } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { memo } from "react";
import { Dustbin } from "./Dustbin";
import { Box } from "./Box";

export default function Package() {
const [seriesTitle,setSeriesTitle] = useState('untitle')
const [tagNames,setTagNames] = useState(["tag0", "tag1", "tag2"])
const [motifs,setMotifs] = useState([
  { id: "1", height: "50", width: "50", src: "/test.png", tag: "tag1" },
  { id: "2", height: "50", width: "50", src: "/test2.png", tag: "tag2" },
  { id: "3", height: "50", width: "50", src: "/test3.png", tag: "" },
]);
　
const Container = () => {
const test=()=>{
    console.log('test');
      setMotifs([...motifs,{ id: "4", height: "50", width: "50", src: "/test3.png", tag: "" }])
}

  const Boxes = ({ tag }) => {
    let tagMotifs = motifs;
    if (tag != null) {
      tagMotifs = motifs.filter(function (motif) {
        return motif.tag == tag;
      });
    }
    console.log(tag);
    return (
      <>
        {tagMotifs.map((motif) => (
          <Box
            key={motif.id}
            id={motif.id}
            height={motif.height}
            width={motif.width}
            src={motif.src}
          />
        ))}
      </>
    );
    // console.log(tagMotifs);
  };
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Parts */}
      <div>
        <button onClick={()=>test}>test</button>
        <Boxes tag="" />
      </div>
      {/* Series */}
      <div style={{ backgroundColor: "#660000", height: "100%" }}>
        <h1 style={{ color: "white", paddingLeft: "10px" }}>{seriesTitle}</h1>
        {tagNames.map((tag) => (
          <Dustbin key={tag} name={tag}>
            <Boxes tag={tag} />
          </Dustbin>
        ))}
      </div>
    </div>
  );
};

  return (
    <>
      {/* Examples */}
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
    </>
  );
}
