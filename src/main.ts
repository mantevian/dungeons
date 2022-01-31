import P5 from "p5";
import Game, { GameStates, PlayerClass } from "./game/game";
import Color from "./util/color";

const sketch = (p5: P5) => {
	let game: Game;
	let montserrat: P5.Font;

	let state: GameStates;

	p5.setup = () => {
		const canvas = p5.createCanvas(1500, 600);
		canvas.parent('canvas');

		p5.rectMode('center');
		p5.angleMode('degrees');
		p5.frameRate(60);

		montserrat = p5.loadFont('//db.onlinewebfonts.com/c/0462590be6674a5827956be5045c54de?family=Montserrat');
		p5.textFont('Montserrat', 20);
		p5.textStyle('bold');

		state = GameStates.MENU;
	}

	p5.draw = () => {
		let c = Color.RGB(37, 33, 53);
		if (game?.room_manager?.current_room) c = game.room_manager.current_room.biome.background_color;
		p5.background(c.red, c.green, c.blue);

		p5.strokeWeight(0);

		switch (state) {
			case 'running':
				p5.push();
				game.tick();
				p5.pop();

				p5.push();
				p5.translate(1100, 0);
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

				state = game.state;

				break;

			case 'menu':
				p5.noLoop();

				let menu: P5.Element;

				let select_text_class = p5.createDiv('choose class');
				let selector = p5.createSelect()
					.child(p5.createElement('option', 'turret').attribute('value', 'turret'))
					.child(p5.createElement('option', 'swordsman').attribute('value', 'swordsman'))
					.child(p5.createElement('option', 'mage').attribute('value', 'mage'))
					.child(p5.createElement('option', 'archer').attribute('value', 'archer'))

				let start_button = p5.createButton('start')
					.style('font-family', 'Montserrat')
					.style('font-weight', '600')
					.style('color', '#33ff33')
					.style('background', '#5c4baa')
					.mousePressed(() => {
						let player_class: PlayerClass;

						switch (selector.value()) {
							case 'swordsman':
								player_class = PlayerClass.SWORDSMAN;
								break;

							case 'mage':
								player_class = PlayerClass.MAGE;
								break;

							case 'archer':
								player_class = PlayerClass.ARCHER;
								break;

							default:
								player_class = PlayerClass.TURRET;
								break;
						}

						game = new Game(p5, player_class);
						menu.remove();
						state = GameStates.RUNNING;
						p5.loop();
					});

				menu = p5.createDiv()
					.child(select_text_class)
					.child(selector)
					.child(start_button)
					.center();

				break;

			case 'dead':
				let text = p5.createDiv('you died! refresh the page to restart').center();
				break;
		}
	}
}

new P5(sketch);