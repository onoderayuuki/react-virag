import { useState } from "react";

import Grid from "@material-ui/core/Grid";
import { IconButton,Box } from "@material-ui/core";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import { Input } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddRoundedIcon from '@material-ui/icons/AddRounded';

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

import { Dustbin } from "../components/Dustbin";
import { DndBox } from "../components/DndBox";

import Header from "./header.js";

export default function Package() {
  const [seriesTitle, setSeriesTitle] = useState("untitle-test");
  const [tagNames, setTagNames] = useState(["tag0", "tag1", "tag2"]);
  const [motifs, setMotifs] = useState([
    { id: "aaaa", height: "50", width: "50", src: "/test.png", tag: "tag1" },
    { id: "bbbb", height: "50", width: "50", src: "/test2.png", tag: "tag2" },
    { id: "cccc", height: "100", width: "100", src: "/test3.png", tag: "" },
    { id: "dddd", height: "100", width: "100", src: "/test2.png", tag: "" },
  ]);
  //保存
  const saveDB = () => {
    console.log("save: ");
  };

  // 変更
  const changeTagName = (index, newName) => {
    const newTags = tagNames.slice();
    newTags[index] = newName;

    const newMotifs = motifs.slice();
    newMotifs.map((motif, i) => {
      if (motif.tag === tagNames[index]) {
        newMotifs[i] = {
          ...motif,
          tag: newName,
        };
      }
    });
    setTagNames(newTags);
    setMotifs(newMotifs);
  };

  const changeTag = (item, Tagname) => {
    const index = motifs.findIndex((value) => value.id == item.id);
    const newMotifs = motifs.slice();
    const newMotif = motifs[index];
    newMotifs[index] = {
      ...newMotif,
      tag: Tagname,
    };
    setMotifs(newMotifs);
  };

  // const Container = () => {
  const Boxes = function Box({ tag }) {
    let tagMotifs = motifs;
    if (tag != null) {
      tagMotifs = motifs.filter(function (motif) {
        return motif.tag == tag;
      });
    }
    return (
      <>
        {tagMotifs.map((motif, i) => (
          <DndBox
            key={motif.id}
            id={motif.id}
            // alt={motif.id}
            height={100}
            width={100}
            src={motif.src}
            onChange={(item, dropResult) => {
              changeTag(item, dropResult);
            }}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <Header>
        <IconButton color="primary" onClick={saveDB}>
          <SaveRoundedIcon fontSize="large" />
        </IconButton>
      </Header>
      <DndProvider backend={TouchBackend}>
      <Grid container spacing={0}>
          <Grid item xs={3}>
            <Boxes tag="" />
          </Grid>
          <Grid
            item
            xs={9}
            style={{ backgroundColor: "#660000", height: "100%" }}
          >
            <Input
              color="secondary"
              style={{ color: "white", fontSize: "25px", paddingLeft: "10px" }}
              defaultValue={seriesTitle}
              onBlur={(e) => {
                console.log(e.target.value);
                setSeriesTitle(e.target.value);
              }}
            />

            {tagNames.map((tag, i) => (
              <Dustbin
                key={tag}
                name={tag}
                onChange={(newName) => {
                  changeTagName(i,newName);
                }}
              >
                <Boxes tag={tag} />
              </Dustbin>
            ))}
            <Box
              style={{color: "#660000",
              margin: "10px",
              border: "solid 2px #660000",
              backgroundColor:'#F6F3EC'}}
              >
              <IconButton 
                // className={classes.materialBox}
              onClick={()=>{setTagNames([...tagNames,"newTag"+tagNames.length])}}>
                <AddRoundedIcon />
                {/* <p>タグを追加</p> */}
              </IconButton>
            </Box>
          </Grid>
        </Grid>      
        </DndProvider>
    </>
  );
}
