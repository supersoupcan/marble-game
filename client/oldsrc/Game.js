import p2 from 'p2';
import * as PIXI from 'pixi.js';

import App from './App.js';

import Marble from './Marble';
import Propellor from './Propellor';
import Terrain from './Terrain';

import { gamecf } from './config';

export default class Game{
  constructor(options){
    this.physics = new p2.World(gamecf.physics); //create it's own file for initialization;
    this.app = new App();
    this.gameObjects = [];
    
    this.lastTime = 0;
    this.fixedTimeStep = 1/60;
    this.maxSubSteps = 60; 
    
    this.gameObjects = [];
    
    this.animate = this.animate.bind(this);
  }
  
  init(){
    this.createEnvironment();
  }
  
  createEnvironment(){
    this.createBounds(true);
    
    /*
    this.addObject(new Terrain({
      position : [-200, 0],
      range : 2,
      width: 400, 
      height: 50,
      density : 1,
    }));
    */
    
    
    this.addObject(new Marble({
      position : [-150, 100]
    }));
  
    
    this.addObject(new Propellor({
      position : [-100, 50],
      angularVelocity : -2
    }));
    
    this.addObject(new Propellor({
      position : [100, 50],
      angularVelocity : 2
    }));
  }
  
  createBounds(){
    let floorBound = new p2.Body({
      mass : 0,
      position : [0, gamecf.yFloorBound]
    });
    floorBound.addShape(new p2.Plane());
    
    let leftBound = new p2.Body({
      angle : 3*Math.PI/2,
      position : [-gamecf.xMirrorBound, 0],
    });
    leftBound.addShape(new p2.Plane());
    
    let rightBound = new p2.Body({
      angle : Math.PI/2,
      position : [gamecf.xMirrorBound, 0]
    });
    rightBound.addShape(new p2.Plane());
    
    this.physics.addBody(floorBound);
    this.physics.addBody(leftBound);
    this.physics.addBody(rightBound);
  }
  
  addObject(gameObject){
    this.physics.addBody(gameObject.body);
    this.app.world.addChild(gameObject.container);
    this.gameObjects.push(gameObject);
  }
  
  render(){
    this.gameObjects.forEach((object) => {
      if(object.dynamic){
        if(object.body.position[0] !== object.container.position.x){
          object.container.position.x = object.body.position[0];
        }
        if(object.body.position[1] !== object.container.position.y){
          object.container.position.y = object.body.position[1];
        }
        if(object.body.angle !== object.container.rotation){
          object.container.rotation = object.body.angle;
        }
      }
    });
  }
  
  animate(time){
    window.requestAnimationFrame(this.animate);
    
    let deltaTime = (time - this.lastTime) / 1000;
    this.physics.step(this.fixedTimeStep, deltaTime, this.maxSubSteps);
    
    this.render();
    
    this.app.renderer.render(this.app.stage);
    
    this.lastTime = time;
  }
}
