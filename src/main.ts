import P5 from "p5";
import Game from "./game/game";

const sketch = (p5: P5) => {
	let game: Game;

	let info: P5.Element;
	let health_text: P5.Element;
	let xp_text: P5.Element;

	p5.setup = () => {
		const canvas = p5.createCanvas(600, 600);
		canvas.parent('canvas');

		p5.rectMode('center');
		p5.angleMode('degrees');
		p5.frameRate(60);

		info = p5.createDiv();
		info.id('info');
		info.parent('canvas');

		health_text = p5.createDiv();
		health_text.id('health_text');
		health_text.parent(info);

		xp_text = p5.createDiv();
		xp_text.id('xp_text');
		xp_text.parent(info);

		game = new Game(p5);
	}

	p5.draw = () => {
		p5.background(37, 33, 53);
		p5.strokeWeight(0);

		health_text.html(`Health: ${Math.floor(game.player.health * 10) / 10} / ${game.player.max_health}`);
		xp_text.html(`XP: ${game.player.xp}`);

		p5.push();
		game.tick();
		p5.pop();
	}
}

new P5(sketch);