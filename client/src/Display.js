import * as PIXI from 'pixi.js';

import { addEvent, getBaseLog } from './methods';

const Display = function(bounds){
  this.bounds = bounds;
  
  this.engine = new PIXI.Application();
  this.overlay = new PIXI.Container();
  this.world = new PIXI.Container();
  this.grid = new PIXI.Graphics();
  
  this.dragging = false;
  this.lastDrag = null;
};

Display.prototype = function(){
  
  const scaling = {
    startAt : 1,
    gridScale : 64,
    scaleFactorLimit : 2,
    scrollFactor : 1 + 1/8
  };
  
  const style = {
    gridThickness : 1,
    gridColor : 0x000000,
    boundThickness : 2,
    boundColor : 0xff0000,
  };
  
  const init = function(){
    this.engine.renderer.view.style.position = "absolute";
    this.engine.renderer.view.style.display = "block";
    this.engine.renderer.backgroundColor = 0xffffff;
  
    this.engine.renderer.autoResize = true;
    this.engine.renderer.resize(window.innerWidth, window.innerHeight);
  
    this.engine.stage.addChild(this.overlay);
    this.engine.stage.addChild(this.world);
    
    this.world.addChild(this.grid);
    
    //ADD LISTENERS
    addEvent(window, 'resize', () => resize.call(this));
    addEvent(window, 'pointerdown', (e) => onDragStart.call(this, e));
    addEvent(window, 'pointerup', (e) => onDragEnd.call(this, e));
    addEvent(window, 'pointerout', (e) => onDragEnd.call(this, e));
    addEvent(window, 'pointermove', (e) => onDragMove.call(this, e));
    addEvent(window, 'wheel', (e) => mouseScroll.call(this, e));
    
    this.world.position.x = this.engine.renderer.width/2;
    this.world.position.y += this.engine.renderer.height;
    this.world.scale.x = scaling.startAt;
    this.world.scale.y = -scaling.startAt;
    
    renderGrid.call(this);
    
    document.body.appendChild(this.engine.view);
  };
  
  let resize = function(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.engine.renderer.resize(w, h);
    
    renderGrid();
  };
 
  /*
  overlay.gridScaleText = new PIXI.Text(
    gamecf.gridScale * Math.pow(2, Math.round(getBaseLog(world.scale.x, 2)))
  );
  
  overlay.addChild(overlay.gridScaleText);
  */
  
  function mouseScroll(event){
    const change = (event.deltaY > 0) ? scaling.scrollFactor : 1/scaling.scrollFactor;
    const nextScale =  change / this.world.scale.x;
    
    const scaleFactor = Math.round(getBaseLog(nextScale, 2));
    const limit = scaling.scaleFactorLimit;
    
    if(scaleFactor <= limit && scaleFactor >= -limit){
      this.world.scale.x /= change;
      this.world.scale.y /= change;
      
      //overlay.gridScaleText.text = gamecf.gridScale * Math.pow(2, scaleFactor);
    }
    
    renderGrid.call(this);
  }
  
  function onDragStart(e){
    this.grid.clear();
    this.dragging = true;
    this.lastDrag = {
      x : e.x,
      y : e.y
    };
  }
  
  function onDragEnd(e){
    if(this.dragging){
      this.dragging = false;
      renderGrid.call(this);
    }
  }
  
  function onDragMove(e){
    if(this.dragging){
      this.world.position.x -= this.lastDrag.x - e.x;
      this.world.position.y -= this.lastDrag.y - e.y;
      
      this.lastDrag = {
        x : e.x,
        y : e.y
      };
    }
  }
  
  let renderGrid = function(){
    this.grid.clear();
    
    const factor = 1/this.world.scale.x;
    
    const sX = this.world.position.x * factor;
    const sY = this.world.position.y * factor;
    const rW = this.engine.renderer.width * factor;
    const rH = this.engine.renderer.height * factor;
    const sW = (sX - rW);
    const sH = (sY - rH);
    
    const scaleFactor = Math.round(getBaseLog(factor, 2));
  
    const gridFactor = scaling.gridScale * Math.pow(2, scaleFactor);
    
    const lineThickness = style.gridThickness * factor;
    const boundThickness = style.boundThickness * factor;
    
    //Issue if scale 

    //rendering issue when scale factor has a decimal (12.5)
    //solved by limiting zoom in and zoom out 
    //(zoomrange 2 =< scaleFactor) =< 2);
    
    this.grid.beginFill(0x000000);
    this.grid.endFill();
    
    //There was a weird issue with x coordinate when changing graph position...
    //making all X coordinates negative seems to have fixed the problem
    
    //TODO: Add Dashed Line
    
    for(let x = sW; x <= sW + rW; x+= 1){
      const fX = -(Math.round(x));
      if(Math.abs(fX) === this.bounds.xMirrorBound){
        this.grid.lineStyle(boundThickness, style.boundColor);
        this.grid.moveTo(fX, sH);
        this.grid.lineTo(fX, rH + sH);
      }else if(Math.round(fX % gridFactor) === 0){
        this.grid.lineStyle(lineThickness, style.gridColor);
        this.grid.moveTo(fX, sH);
        this.grid.lineTo(fX, rH + sH);
      }
    }
    
    for(let y = sH; y <= sH + rH; y += 1){
      const fY = Math.round(y);
      if(fY === 0 || fY === this.bounds.yRoofBound){
        this.grid.lineStyle(boundThickness, style.boundColor, 1);
        this.grid.moveTo(-(sW), fY);
        this.grid.lineTo(-(rW + sW), fY);
      }else if(Math.round(fY % gridFactor === 0)){
        this.grid.lineStyle(lineThickness, style.gridColor, 1);
        this.grid.moveTo(-(sW), fY);
        this.grid.lineTo(-(rW + sW), fY);
      }
    }
  };
  
  return({
    init : init,
  });
}();

export default Display;