import Game from './Game';

import { gamecf } from './config';

import Marble from './Marble';
import Platform from './Platform';

let game = new Game();

game.addObject(new Platform(
  [-100, -100], 0, [{
    type : "CURVE",
    base : 64,
    width : 1024,
  }])
);


game.addObject(new Marble([0, 2000]));


game.init();
