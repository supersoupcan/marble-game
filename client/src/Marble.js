import GameObject from './GameObject';

let Marble = function(position){
  const color = 0x000000;
  const radius = 24;
  const mass = 12;
  
  GameObject.call(this, {radius, mass}, true); 
  this.addCircle(radius, color);
  this.body.position = position;
};

Marble.prototype = function (){
  return Object.assign(Object.create(GameObject.prototype), {
    method : "some marble method"
  });
}();

Marble.prototype.constructor = Marble;

export default Marble;