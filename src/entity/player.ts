import Game from "../game/game";
import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import BasicProjectile from "./basic_projectile";
import Entity from "./entity";

export default class Player extends Entity {
	game: Game;

	constructor(game: Game) {
		super();

		this.game = game;
		this.size = new Vec2(0.9, 0.9);
		this.color = Color.RGB(40, 255, 40);
		this.corner_radius = 0.4;
	}

	attack(): void {
		let projectile = new BasicProjectile(true);
		projectile.set_position(this.get_position());
		projectile.velocity = Vec2.from_angle(this.facing).multiply(0.2);

		this.game.room_manager.current_room.entities.spawn(projectile);
	}

	keydown(keys: Map<string, number>): void {
		let move = new Vec2(0, 0);

		for (let code of keys.keys())
			switch (code) {
				case 'KeyW':
					move = move.add(new Vec2(0, -1));
					break;

				case 'KeyA':
					move = move.add(new Vec2(-1, 0));
					break;

				case 'KeyS':
					move = move.add(new Vec2(0, 1));
					break;

				case 'KeyD':
					move = move.add(new Vec2(1, 0));
					break;
			}

		this.move(move);
	}

	keyup(e: KeyboardEvent): void {
		this.current_move_timeout = Math.floor(this.move_timeout / 2);
	}

	mousedown(e: MouseEvent): void {
		this.attack();
	}

	tick(): void {
		super.tick();
	}

	can_go_through(position: Vec2): boolean {
		return this.game.room_manager.passable(position);
	}

	render(): void {
		super.render();

		Renderer.pointer(this.get_position(), this.facing);
	}
}