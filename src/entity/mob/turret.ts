import Renderer from "../../game/renderer";
import Vec2 from "../../util/vec2";
import Mob from "../mob";
import Bullet from "../projectile/bullet";

export default class Turret extends Mob {
	constructor() {
		super();
	}

	tick(): void {
		super.tick();

		this.look(Renderer.canvas_coords(this.manager.room.manager.game.player.position));

		if (this.lifetime % 50 == 0)
			this.walk();

		if (this.lifetime % 120 == 0)
			this.try_attack();
	}

	attack(): void {
		this.manager.spawn_projectile(new Bullet(this, this.attack_damage), this.facing, 0.2, this.position);
		this.scale = 1.1;
		this.scale_over_time(1, 10);
	}

	update_path(): void {
		super.update_path();
		this.path = this.manager.room.tiles.find_path(this.position, this.manager.room.manager.game.player.position.add(new Vec2(this.manager.random.next_int_ranged(-1, 1), this.manager.random.next_int_ranged(-1, 1))));
	}
}