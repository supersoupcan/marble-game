import GameObject from './GameObject';
import p2 from 'p2';
import worldcf from './config';

import { rotateVertice, defaultProps } from './methods';

const defaults = {
  type: p2.Body.KINEMATIC,
  mass: 0,
  position : [0, 0],
  angularVelocity: 2,
  dynamic : true,
  blades : 2,
  width: 50,
  height: 5,
  radius: 5
};

export default class Propellor extends GameObject{
  constructor(props){
    props = defaultProps(props, defaults);
    
    super(props);
    
    const centerpeice = {
      physics : new p2.Circle({
        radius : props.radius,
        material : new p2.Material('border'),
      }),
      draw : {
        color : 0x00FF00
      }
    };
    
    const blades = [...Array(props.blades)].map((blades, index) => {
      const angle = ((index*2*Math.PI) / props.blades) + Math.PI;
      
      const base = [
        [0, (props.height/2)],
        [0, -props.height/2],
        [props.width, -props.height/2],
        [props.width, props.height/2]
      ];
      
      const rotatedVertices = base.map(points => {
        return rotateVertice(points, angle);
      });
      
      return({ 
        physics : new p2.Convex({
          vertices : rotatedVertices,
          material : new p2.Material('border'),
        }),
        draw : {
          color : 0x00FF00
        }
      });
    });
  
    this.shapes = [
      centerpeice, ...blades
    ];

    this.init();
  }
}