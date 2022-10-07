import Renderer from "../../game/renderer";
import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import Mob from "../mob";
import Arrow from "../projectile/arrow";

export default class Archer extends Mob {
	random_recharge: number;

	constructor() {
		super();

		this.health.reset(15);
		
		this.start_prepare_attack = 20;
		this.attack_damage = 4;

		this.size = new Vec2(0.65, 0.65);
		this.corner_radius = 0.15;

		this.color = Color.RGB(16, 255, 192);

		this.random_recharge = 0;

		this.gold = 15;
	}

	tick(): void {
		super.tick();

		this.look(Renderer.canvas_coords(this.manager.room.manager.game.player.position));

		if (this.lifetime % (45 + this.random_recharge) == 0) {
			this.walk();
			this.random_recharge = this.manager.random.next_int_ranged(0, 45);
		}

		if (this.lifetime % 75 == 0)
			this.try_attack();
	}

	attack(): void {
		let arrow = new Arrow(this, this.attack_damage);
		arrow.rotation = this.facing;
		this.manager.spawn_projectile(arrow, this.facing, 0.25, this.position);
		this.scale = 1.1;
		this.scale_over_time(1, 10);
	}

	update_path(): void {
		super.update_path();
		this.path = this.manager.room.tiles.find_path(this.position, this.manager.room.manager.game.player.position.add(new Vec2(this.manager.random.next_int_ranged(-1, 1), this.manager.random.next_int_ranged(-1, 1))));
	}
}