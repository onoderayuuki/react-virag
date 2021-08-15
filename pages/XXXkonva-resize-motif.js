
import { Stage, Layer, Rect, Circle,Image } from 'react-konva';
import useImage from 'use-image';
import Style from '../styles/index.module.css';
import React from 'react'
import reactImageSize from 'react-image-size';

    let imageWIDTH = 0;
    reactImageSize("https://konvajs.org/assets/yoda.jpg")
    .then(({ width, height }) => {
      imageWIDTH =  width;
      console.log(width, height);
      // return <p> 画像の高さ{ this.state.imageWIDTH } </p>
    })
    .catch((errorMessage) => {console.log('error');});


export default function Home(){
  return (
    <div>
      <div className = { Style.inputs }>
        たて<input type="text"></input>
        よこ<input type="text"></input>
      </div>
      <sizeImage />
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <URLImage src="https://konvajs.org/assets/yoda.jpg"/>
        </Layer>
      </Stage>
    </div>
  );
  
}


//Imageを描画するクラス
class URLImage extends React.Component {
  state = {
    image: null
  };
  componentDidMount() {
    this.loadImage();
  }
  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }
  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }
  loadImage() {
    // save to "this" to remove "load" handler on unmount
    this.image = new window.Image();
    this.image.src = this.props.src;
    this.image.addEventListener('load', this.handleLoad);
  }
  handleLoad = () => {
    // after setState react-konva will update canvas and redraw the layer
    // because "image" property is changed
    this.setState({
      image: this.image
    });
    // if you keep same image object during source updates
    // you will have to update layer manually:
    // this.imageNode.getLayer().batchDraw();
    // console.log(this.image);
  };
  render() {
    return (
      <Image
        x={this.props.x}
        y={this.props.y}
        height={this.props.height}
        image={this.state.image}
        ref={node => {
          this.imageNode = node;
        }}
      />
    );
  }
}

