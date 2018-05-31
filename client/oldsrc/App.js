import * as PIXI from 'pixi.js';
import { addEvent, getBaseLog } from './methods';

import { gamecf } from './config';


export default class App extends PIXI.Application{
  constructor(){
    super();
    document.body.appendChild(this.view);
  
    //STYLES
    this.renderer.view.style.position = "absolute";
    this.renderer.view.style.display = "block";
    this.renderer.backgroundColor = gamecf.backgroundColor;
    
    //CREATE OVERLAY VIEW
    this.overlay = new PIXI.Container();
    this.stage.addChild(this.overlay);
    
    //CREATE WORLD VIEW
    this.world = new PIXI.Container();
    this.stage.addChild(this.world);

    //RESIZE
    this.renderer.autoResize = true;
    this.renderer.resize(window.innerWidth, window.innerHeight);
    addEvent(window, 'resize', () => this.resize());
    
    //POSITION
    this.world.position.x = this.renderer.width/2;
    this.world.position.y = this.renderer.height;
      
    this.dragging = false;
    this.draggingData = null;
    addEvent(window, 'pointerdown', (e) => this.onDragStart(e));
    addEvent(window, 'pointerup', (e) => this.onDragEnd(e));
    addEvent(window, 'pointerout', (e) => this.onDragEnd(e));
    addEvent(window, 'pointermove', (e) => this.onDragMove(e));
    
    //SCALE
    this.world.scale.x = gamecf.scale;
    this.world.scale.y = -gamecf.scale;
    addEvent(window, 'wheel', (event) => this.mouseScroll(event));
    
    this.overlay.gridScaleText = new PIXI.Text(
      gamecf.gridScale * Math.pow(2, Math.round(getBaseLog(this.world.scale.x, 2)))
    );
    
    this.overlay.addChild(this.overlay.gridScaleText);
    
    //GRID
    this.grid = new PIXI.Graphics();
    this.world.addChild(this.grid);
    this.renderGrid();
    
  }
  
  resize(){
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.resize(w, h);
    
    //TODO: Center world position on resize
  
    //this.world.position.x = this.renderer.width;
    //this.world.position.y = this.renderer.height;
    
    this.renderGrid();
  }
  
  mouseScroll(event){
    const change = (event.deltaY > 0) ? gamecf.scrollFactor : 1/gamecf.scrollFactor;
    const nextScale =  change / this.world.scale.x;
    
    
    const scaleFactor = Math.round(getBaseLog(nextScale, 2));
    const limit = gamecf.scaleFactorLimit;
    
    console.log(scaleFactor);
    
    if(scaleFactor <= limit && scaleFactor >= -limit){
      this.world.scale.x /= change;
      this.world.scale.y /= change;
      
      
      this.overlay.gridScaleText.text = gamecf.gridScale * Math.pow(2, scaleFactor);
    }
    
    this.renderGrid();
  }
  
  onDragStart(e){
    this.grid.clear();
    this.dragging = true;
    this.lastDrag = {
      x : e.x,
      y : e.y
    };
  }
  
  onDragEnd(){
    if(this.dragging){
      this.dragging = false;
      this.renderGrid();
    }
  }
  
  onDragMove(e){
    if(this.dragging){
      this.world.position.x -= this.lastDrag.x - e.x;
      this.world.position.y -= this.lastDrag.y - e.y;
      
      this.lastDrag = {
        x : e.x,
        y : e.y
      };
    }
  }
  
  renderGrid(){
    this.grid.clear();
    
    const factor = 1/this.world.scale.x;
    
    const sX = this.world.position.x * factor;
    const sY = this.world.position.y * factor;
    const rW = this.renderer.width * factor;
    const rH = this.renderer.height * factor;
    const sW = (sX - rW);
    const sH = (sY - rH);
    
    const scaleFactor = Math.round(getBaseLog(factor, 2));
    
    console.log(scaleFactor);
    const grid = gamecf.gridScale * Math.pow(2, scaleFactor);
    
    //console.log(rW, rH, sX, sH, sW, sH);
    const lineThickness = gamecf.gridThickness * factor;
    const boundThickness = gamecf.boundThickness * factor;
    
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
      if(Math.abs(fX) === gamecf.xMirrorBound){
        this.grid.lineStyle(boundThickness, gamecf.boundColor);
        this.grid.moveTo(fX, sH);
        this.grid.lineTo(fX, rH + sH);
      }else if(Math.round(fX % grid) === 0){
        this.grid.lineStyle(lineThickness, gamecf.gridColor);
        this.grid.moveTo(fX, sH);
        this.grid.lineTo(fX, rH + sH);
      }
    }
    
    for(let y = sH; y <= sH + rH; y += 1){
      const fY = Math.round(y);
      if(fY === gamecf.yFloorBound){
        this.grid.lineStyle(boundThickness, gamecf.boundColor, 1);
        this.grid.moveTo(-(sW), fY);
        this.grid.lineTo(-(rW + sW), fY);
      }else if(Math.round(fY % grid === 0)){
        this.grid.lineStyle(lineThickness, gamecf.gridColor, 1);
        this.grid.moveTo(-(sW), fY);
        this.grid.lineTo(-(rW + sW), fY);
      }
    }
  }
}
