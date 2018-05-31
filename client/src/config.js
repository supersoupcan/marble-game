export const gamecf = {
  fixedTimeStep : 1/60,
  maxSubSteps : 60,
  scale : 1,
  gridScale : 64,
  scaleFactorLimit : 2,
  physics : {
    gravity : [0, -100]
  },
  yRoofBound : 5120,
  yFloorBound : 0,
  xMirrorBound : 2560,
  scrollFactor : 1 + 1/8,
  backgroundColor : 0xffffff,
  gridColor : 0x000000,
  gridThickness : 1,
  boundColor : 0xff0000,
  boundThickness : 2,
};