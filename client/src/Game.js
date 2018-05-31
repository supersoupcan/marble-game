import p2 from 'p2';

import Display from './Display';
//import GameObject from './GameObject';

import Plane from './Plane';

import { gamecf } from './config';

//get rid of config, pass as argument through constructor 
//or encapsulate as const in constructor;

let Game = function(){
  this.bounds = {
    yRoofBound : 5120,
    xMirrorBound : 2560,
  };
  
  this.physics = new p2.World({ gravity : [0, -100]});
  this.display = new Display(this.bounds);
  this.lastTime = 0;
  this.gameObjects = [];
};


Game.prototype = function(){
  let addObject = function(gameObject){
    this.physics.addBody(gameObject.body);
    this.display.world.addChild(gameObject.container);
    if(gameObject.dynamic){
      this.gameObjects.push(gameObject);
    }
  };
  
  function animate(time){
    window.requestAnimationFrame((newTime) => animate.call(this, newTime));
    
    let deltaTime = (time - this.lastTime) / 1000;
    
    render.call(this);
    this.physics.step(gamecf.fixedTimeStep, deltaTime, gamecf.maxSubSteps);
    
    
    this.lastTime = time;
  };
  
  function createBounds(){
    addObject.call(this, new Plane([0, 0,], 0));
    addObject.call(this, new Plane([0, this.bounds.yRoofBound], Math.PI));
    addObject.call(this, new Plane([this.bounds.xMirrorBound, 0], Math.PI/2));
    addObject.call(this, new Plane([-this.bounds.xMirrorBound, 0], 3*Math.PI/2));
  };
  
  function init(){
    this.display.init();
    //createBounds.call(this);
    animate.call(this, 0);
  };
  
  let render = function(){
    this.gameObjects.forEach((gameObject) => {
      gameObject.reposition();
    });
  };
  
  return {
    addObject : addObject,
    init : init,
  };
}();

export default Game;