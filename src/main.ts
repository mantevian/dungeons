import P5 from "p5";
import Game from "./game/game";

const sketch = (p5: P5) => {
	let game: Game;
	let montserrat: P5.Font;

	p5.setup = () => {
		const canvas = p5.createCanvas(800, 600);
		canvas.parent('canvas');

		p5.rectMode('center');
		p5.angleMode('degrees');
		p5.frameRate(60);

		montserrat = p5.loadFont('//db.onlinewebfonts.com/c/0462590be6674a5827956be5045c54de?family=Montserrat');
		p5.textFont('Montserrat', 20);

		game = new Game(p5);
	}

	p5.draw = () => {
		p5.background(37, 33, 53);
		p5.strokeWeight(0);

		p5.push();
		game.tick();
		p5.pop();

		p5.push();
		p5.rectMode('corner');
		
		p5.fill(64, 128, 64);
		p5.rect(615, 5, 160, 40);

		p5.fill(64, 256, 64);
		p5.rect(620, 10, 150 * game.player.health / game.player.max_health, 30);

		p5.fill(0, 0, 0);
		p5.text(`${game.player.health} / ${game.player.max_health}`, 630, 32);
		p5.text(`XP: ${game.player.xp}`, 630, 70);
		p5.pop();
	}
}

new P5(sketch);