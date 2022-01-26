import P5 from "p5";
import Game from "./game/game";

const sketch = (p5: P5) => {
	let game: Game;
	let montserrat: P5.Font;

	p5.setup = () => {
		const canvas = p5.createCanvas(1200, 600);
		canvas.parent('canvas');

		p5.rectMode('center');
		p5.angleMode('degrees');
		p5.frameRate(60);

		montserrat = p5.loadFont('//db.onlinewebfonts.com/c/0462590be6674a5827956be5045c54de?family=Montserrat');
		p5.textFont('Montserrat', 20);
		p5.textStyle('bold');

		game = new Game(p5);
	}

	p5.draw = () => {
		p5.background(37, 33, 53);
		p5.strokeWeight(0);

		switch (game.state) {
			case 'running':
				p5.push();
				game.tick();
				p5.pop();

				p5.push();
				p5.translate(1000, 0);
				p5.rectMode('corner');

				p5.fill(64, 128, 64);
				p5.rect(15, 5, 160, 40);

				p5.fill(64, 256, 64);
				p5.rect(20, 10, 150 * game.player.health / game.player.max_health, 30);

				p5.fill(0, 0, 0);
				p5.text(`${game.player.health} / ${game.player.max_health}`, 30, 32);

				p5.fill(255, 255, 255);
				p5.text(`XP: ${game.player.xp}`, 30, 70);
				p5.pop();

				break;

			case 'menu':
				p5.noLoop();

				let start_button = p5.createButton('start');
				start_button.style('font-family', 'Montserrat');
				start_button.style('font-weight', '600');
				start_button.style('color', '#33ff33');
				start_button.style('background', '#5c4baa');
				start_button.center();
				start_button.mousePressed(() => {
					game.start();
					start_button.remove();
					p5.loop();
				});
				
				break;
			
			case 'dead':

				break;
		}
	}
}

new P5(sketch);