import GameObject from './GameObject';

let Plane = function(position, angle){
  GameObject.call(this, {position, angle}, false);
  this.addPlane();
};

Plane.prototype = function(){
  //some private method
  
  return Object.assign(Object.create(GameObject.prototype), {
    //some public method
  });
}();

Plane.prototype.constructor = Plane;

export default Plane;