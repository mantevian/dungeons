import P5 from "p5";
import Game from "./game/game";

const sketch = (p5: P5) => {
	let game: Game;

	p5.setup = () => {
		const canvas = p5.createCanvas(600, 600);
		canvas.parent('canvas');
		p5.rectMode('center');
		p5.angleMode('degrees');
		p5.frameRate(60);

		game = new Game(p5);
	}

	p5.draw = () => {
		p5.background(37, 33, 53);
		p5.strokeWeight(0);

		game.tick();
	}
}

new P5(sketch);