import p2 from 'p2';
import * as PIXI from 'pixi.js';

import { rotateVertice, defaultProps } from './methods';

import _ from 'underscore';

export default class GameObject{
  constructor(options){
    //Should the renderer update this objects position and rotation each frame?
    this.dynamic = options.dynamic;
    
    let bodyProps = {};
    const bodyKeys = [
      'force', 'position', 'collisionResponse', 'angle', 
      'angularForce', 'angularVelocity', 'mass'
    ];
    
    bodyKeys.forEach(key => {
      if(options.hasOwnProperty(key)){
        bodyProps[key] = options[key];
      }
    });
    
    
    this.body = new p2.Body(bodyProps);
    
    this.container = new PIXI.Container();
    this.container.position = new PIXI.Point(this.body.position[0], this.body.position[1]);
    this.container.rotation = this.body.angle;
    
    
    this.shapes = [];
  }
  
  init(){
    this.createPhysics();
    this.renderPhysics();
  }
  
  createPhysics(){
    this.shapes.forEach((shape) => {
      this.body.addShape(shape.physics);
    });
  }
  
  renderPhysics(){
    //this.container.removeChidren();
    this.shapes.map((shape, index) => {
      let graphic = new PIXI.Graphics();
      
      //graphic.interactive = true;
      //graphic.on('pointerdown', () => console.log('hello'));
      
      graphic.rotation = shape.physics.angle;
      
      switch(shape.physics.type){
        case 1 : {
          //CIRCLE
          graphic.beginFill(shape.draw.color);
          graphic.drawCircle(
            shape.physics.position[0],
            shape.physics.position[1], 
            shape.physics.radius
          );
          break;
        }
        case 8 : {
          //CONVEX
          graphic.beginFill(shape.draw.color);
          const coordinates = _.flatten(
            shape.physics.vertices.map(
              (coordpair) => Array.from(coordpair)
            ).reverse()
          );
          graphic.drawPolygon(coordinates);
          break;
        }
        case 128 : {
          //HeightMap
          graphic.beginFill(shape.draw.color);
          
          const widthInc = shape.physics.elementWidth;
          const totalWidth = (shape.physics.heights.length - 1)* widthInc;
          
          graphic.moveTo(0, 0);
          shape.physics.heights.map((height, index) => {
              graphic.lineTo(index * widthInc, height);
          });
          
          graphic.lineTo(totalWidth, 0);
        }
      }
      graphic.endFill();
      this.container.addChild(graphic);
    });

  
  }
}