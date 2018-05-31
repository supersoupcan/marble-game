import GameObject from './GameObject';
import p2 from 'p2';
import { rotateVertice, defaultProps } from './methods';

const defaults = {
  mass : 0,
};

/*this component creates hight maps (precise horizontal surfaces);
Terrain properties:
section : [
  density : the amount of height data points per pixel;
  width : how many pixels the section goes in the x direction,
  base : how many pixels the terrain is elevated above the ground
  pattern : match a particular heightDataPattern
  //
]
*/

export default class Terrain extends GameObject{
  constructor(props){
    props = defaultProps(props, defaults);
    super(props);
    //PIXELS PER POINT = 200/100 = 2 
    
    this.shapes = [];
    
    props.sections.forEach((section, index) => {
      let sectionHeightData;
      const heightDataLength = (props.width * props.density);
      const iterateOver = [...Array(heightDataLength) + 1];
      
      switch(section.pattern){
        case "COS" : {
          sectionHeightData = iterateOver.map((height, index) => {
            return (
              (0.5*props.height * Math.cos(index/heightDataLength * props.iterations*2*Math.PI))
              + 0.5*props.height
            );
          });
          break;
        }
      }
    });

    const heightDataLength = Math.floor(props.width * props.density);
    
    const heights = [...Array(heightDataLength + 1)].map((height, index) => {
      return (0.5*props.height * Math.cos(index/heightDataLength * props.range*Math.PI)) + 0.5*props.height;
    });
    
    this.shapes = [{
      physics : new p2.Heightfield({
        heights,
        elementWidth : props.width / heightDataLength
      }),
      draw : {
        color : 0x000000
      }
    }];
    
      this.init();
  }
}