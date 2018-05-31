import p2 from 'p2';
import * as PIXI from 'pixi.js';

import _ from 'underscore';
//revelaing-prototype-pattern

//

let GameObject = function(bodyprops, dynamic){
  this.body = new p2.Body(bodyprops);
  this.container = new PIXI.Container();
  
  this.container.position = new PIXI.Point(this.body.position[0], this.body.position[1]);
  this.container.rotation = this.body.angle;
  
  this.dynamic = dynamic;
};

GameObject.prototype = function(){
  function addGraphics(){
    let graphics = new PIXI.Graphics();
    this.container.addChild(graphics);
  }
  
  function reposition(){
    if(this.body.position[0] !== this.container.position.x){
      this.container.position.x = this.body.position[0];
    }
    if(this.body.position[1] !== this.container.position.y){
      this.container.position.y = this.body.position[1];
    }
    if(this.body.angle !== this.container.rotation){
      this.container.rotation = this.body.angle;
    }
  }
  
  function addPlane(){
    let shape = new p2.Plane();
    this.body.addShape(shape);
  }
  
  function addCircle(radius, fill){
    let shape = new p2.Circle({ radius });
    this.body.addShape(shape);
    addGraphics.call(this);
    draw.call(this, {type : "CIRCLE", x : shape.position[0], y : shape.position[1], radius, fill});
  }
  
  function addPlatform(sections){
    function curve(i, l, h, b, r, s){
      return (0.5*h * Math.cos(i/l*(2*Math.PI*(r + s)))
        + 0.5*h + b);
    }
    function linear(i, l, h, b, r, s){
      //TODO: add s and r
      return b + i/h*h;
    }
    function halfPipe(i, l, h, b, r, s){
      return -Math.sqrt(
          Math.pow(h, 2) - Math.pow(2*r*h*((i + s * l/r)
          % (l/r)) / l - h, 2)
        ) + h + b;
    }
    function halfCircle(i, l, h, b, r, s){
      return Math.sqrt(
          Math.pow(h, 2) - Math.pow(2*r*h*((i + s*l/r)
          % (l/r)) / - h, 2)
        ) + b;
    }
    
    const density = 1/16
    
    const sectionHeights = sections.map((section, index) => {
      const type = section.type || "LINEAR";
      const width = section.width * density || 512 * density;
      const height = section.height || 256;
      const base = section.base || 0;
      const repetitions = section.repetitions || 1;
      const startAt = section.startAt || 0;
      
      const emptyArrOfLength = [...Array(width + 1)];
      let formula;
      switch(type){
        case "CURVE" : {
          formula = curve;
          break;
        }
        case "LINEAR" : {
          formula = linear;
          break;
        }
        case "HALF-PIPE" : {
          formula = halfPipe;
          break;
        }
        case "HALF-CIRCLE" : {
          formula = halfCircle;
          break;
        }
      } 
      return emptyArrOfLength.map((nothing, index) => {
        const answer =  formula(
          index, width, 
          height, base, 
          repetitions, startAt
        );
        return answer;
      });
    });
    
    const heights = _.flatten(sectionHeights);
    
    this.body.addShape(new p2.Heightfield({
      heights : heights,
      elementWidth : 1/density
    }));
    
    console.log(new p2.Heightfield({
      heights : heights,
      elementWidth : 1/density
    }));
    
    addGraphics.call(this);
    draw.call(this, { type : "PLATFORM", heights, density, fill : 0xFF0000 });
  }
  
  function draw(props){
    let graphics = this.container.getChildAt(this.container.children.length - 1);
    
    graphics.beginFill(props.fill || 0x000000);
    
    switch(props.type){
      case "CIRCLE" : {
        graphics.drawCircle(
          props.x,
          props.y,
          props.radius,
        );
        break;
      }
      case "CONVEX" : {
        const coordinates = _.flatten(
            props.vertices.map(
              (coordpair) => Array.from(coordpair)
            ).reverse()
          );
        graphics.drawPolygon(coordinates);
        break;
      }
      case "PLATFORM" : {
        const totalWidth = (props.heights.length - 1);
        
        //console.log(totalWidth);
        
        graphics.moveTo(0, 0);
        props.heights.map((height, index) => {
          graphics.lineTo(index / props.density, height);
        });
        
        graphics.lineTo(totalWidth / props.density, 0);
        break;
      }
    }
  }
  return{
    addCircle : addCircle,
    addPlane : addPlane,
    addPlatform : addPlatform,
    reposition : reposition
  };
}();

GameObject.prototype.constructor = GameObject;


export default GameObject;