import { Paper, Typography, Box } from "@material-ui/core";
import Header from "../components/header.js";
import Image from "next/image";
import howto1 from "../public/howto1.png";
import howto2 from "../public/howto2.png";
import howto3 from "../public/howto3.png";
import howto4 from "../public/howto4.png";
import howto5 from "../public/howto5.png";
import howto6 from "../public/howto6.png";
import howto7 from "../public/howto7.png";
import howto8 from "../public/howto8.png";
import howto9 from "../public/howto9.png";
import howto10 from "../public/howto10.png";

export default function Help() {
  const paperStyle = {
    padding: 10,
    margin: "10px auto",
    width:"90%"
  };
  const titleStyle = {
    padding: 10,
  };
  return (
    <>
      <Header>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Virág
        </Typography>
      </Header>
<Box style={{backgroundColor: "#F6F3EC"}}>
      <Typography variant="h6" style={titleStyle}>
        使い方
      </Typography>

      <Paper style={paperStyle}>
        <Typography variant="body2">
          ✖️デザイン画の商用利用はお控え下さい。
          <br />
          ⭕️個人利用の範囲内でSNSなどへの投稿はご自由にお楽しみ下さい。
          <br />
          ❕剽窃対策として切り取られない部分に©︎をいれる等の対策はご自身でお願いいたします。
        </Typography>
      </Paper>

      <Paper style={paperStyle}>
        <Typography variant="body2">
          「公開されているデザイン」もしくは
          <br />
          「あなたのデザインの＋」からはじめます
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Image src={howto1} width={100} height={219} alt={"#"}></Image>
        </Box>
      </Paper>

      <Paper style={paperStyle}>
        <Typography variant="body2">
          編集画面では「＋」からモチーフを追加できます
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Image src={howto2} width={100} height={219} alt={"#"}></Image>
          <Image src={howto3} width={100} height={219} alt={"#"}></Image>
        </Box>
      </Paper>

      <Paper style={paperStyle}>
        <Typography variant="body2">保存するとホーム画面に残ります</Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Image src={howto4} width={100} height={219} alt={"#"}></Image>
          <Image src={howto5} width={100} height={219} alt={"#"}></Image>
        </Box>
      </Paper>

      <Paper style={paperStyle}>
        <Typography variant="body2">
          グリッド線はオンオフできます
          <br />
          ※保存や画像ダウンロードの際も残るため、必要に応じてオフにしてください
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Image src={howto10} width={100} height={219} alt={"#"}></Image>
        </Box>
      </Paper>

      <Paper style={paperStyle}>
        <Typography variant="body2">
          作者に作成した内容を共有したい場合はこちらでURLをコピペして送ってください
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Image src={howto6} width={100} height={219} alt={"#"}></Image>
        </Box>
      </Paper>

      <Paper style={paperStyle}>
        <Typography variant="body2">
          画像ダウンロードしたい場合はこちらから
          <br />
          ※お使いのブラウザによってはダウンロードができない場合がございます
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Image src={howto7} width={100} height={219} alt={"#"}></Image>
        </Box>
      </Paper>

      <Paper style={paperStyle}>
        <Typography variant="body2">
          アカウント登録とログインを行うと
          <br />
          別の端末やブラウザからも保存したデザインの閲覧編集ができます。
        </Typography>
        <Box style={{ display: "flex", justifyContent: "space-around" }}>
          <Image src={howto8} width={100} height={219} alt={"#"}></Image>
          <Image src={howto9} width={100} height={219} alt={"#"}></Image>
        </Box>
      </Paper>
</Box>

    </>
  );
}
