import GameObject from './GameObject';
import p2 from 'p2';
import { rotateVertice, defaultProps } from './methods';

const defaults = {
  position : [0, 0],
  mass : 20,
  damping : 0,
  angularDamping : 0,
  angularVelocity : 10,
  dynamic : true,
  radius : 10,
};


export default class Marble extends GameObject{
  constructor(props){
  props = defaultProps(props, defaults);
    super(props);
    this.shapes = [
      {
        physics : new p2.Circle({
          radius : props.radius,
          material : new p2.Material('marble'),
        }),
        draw : {
          color : 0x00FF00
        }
      } 
    ];
    
    this.init();
  }
}