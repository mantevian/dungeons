import Game from "../game/game";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";

export default class Player extends Entity {
	game: Game;

	constructor(game: Game) {
		super();

		this.game = game;
		this.size = new Vec2(1, 1);
		this.color = Color.RGB(40, 255, 40);
		this.corner_radius = 0.4;
	}

	move(vec: Vec2): void {
		let new_position = this.position.add(vec);

		if (this.game.room_manager.passable(new_position))
			this.set_position(new_position);
	}
}