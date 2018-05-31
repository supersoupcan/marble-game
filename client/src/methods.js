export function rotateVertice(vertice, angle){
  //assuming origin is [0,0]
  return [
    vertice[0]*Math.cos(angle) - vertice[1]*Math.sin(angle),
    vertice[0]*Math.sin(angle) + vertice[1]*Math.cos(angle)
  ];
}

export function getBaseLog(exp, base){
  return Math.log(exp) / Math.log(base);
}

export function defaultProps(props, defaults){
  let newProps = {};
  const skeleton = Object.assign({}, props, defaults);
  Object.keys(skeleton).forEach(key => {
    newProps[key] = props[key] || defaults[key];
  });
  return newProps;
}

export const addEvent = function(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return;
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
    object.attachEvent("on" + type, callback);
  } else {
    object["on"+type] = callback;
  }
};