import GameObject from './GameObject';
import p2 from 'p2';
import { defaultProps } from './methods';

const defaults = {
  mass : 0
};

export default class Plane extends GameObject{
  constructor(props){
    props = defaultProps(props, defaults);
    super(props);
    
    this.shapes = [{
      physics : new p2.Plane(),
      draw : {
        color : 0xff0000
      }
    }];
    
    this.init();
  }
}