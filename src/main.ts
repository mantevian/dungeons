import P5 from "p5";
import Entity from "./entity/entity";
import Game from "./game/game";
import Vec2 from "./util/vec2";

const sketch = (p5: P5) => {
	let game = new Game(p5);

	p5.setup = () => {
		const canvas = p5.createCanvas(630, 630);
		canvas.parent('canvas');
	}

	p5.draw = () => {
		p5.background('black');
		p5.fill('white');

		let entity = new Entity();
		entity.set_position(new Vec2(5, 0));
		game.room_manager.current_room.entities.spawn(entity);

		game.tick();
	}
}

new P5(sketch);