import * as PIXI from 'pixi.js';
import Game from './Game';

let game = new Game(
    {physics : {
        gravity: [0, -100]
    }}
);

game.init();
game.animate();
