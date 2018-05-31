import GameObject from './GameObject';

import _ from 'underscore';

let Platform = function(position, angle, sections){
  GameObject.call(this, {position, angle, mass : 0}, false);
  this.addPlatform(sections);
};

Platform.prototype = function(){
  //some private method
  
  return Object.assign(Object.create(GameObject.prototype), {
    //some public method
  });
}();

Platform.prototype.constructor = Platform;

export default Platform;