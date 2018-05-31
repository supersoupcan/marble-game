export function PatternGenerator(props){
  const base = props.base;
  const height = props.height;
  
  const heightDataLength = (props.width * props.density);
  
  let heightData;
  
  switch(props.pattern){
    case "COS" : {
      heightData = [...Array(heightDataLength + 1)].map((height, index) => {
        return(
          (0.5*props.height * Math.cos(index/heightDataLength * props.iterations*2*Math.PI))
          + 0.5*props.height
        );
      });
    }
  }
}