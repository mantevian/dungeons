import Renderer from "../../game/renderer";
import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import Mob from "../mob";
import Fireball from "../projectile/fireball";

export default class Mage extends Mob {
	random_recharge: number;

	constructor() {
		super();

		this.health.reset(20);
		
		this.start_prepare_attack = 40;
		this.attack_damage = 0;

		this.corner_radius = 0.3;

		this.color = Color.RGB(255, 128, 16);

		this.random_recharge = 0;

		this.gold = 15;
	}

	tick(): void {
		super.tick();

		this.look(Renderer.canvas_coords(this.manager.room.manager.game.player.position));

		if (this.lifetime % 90 == 0)
			this.walk();

		if (this.lifetime % (45 + this.random_recharge) == 0) {
			this.try_attack();
			this.random_recharge = this.manager.random.next_int_ranged(0, 45);
		}
	}

	attack(): void {
		this.manager.spawn_projectile(new Fireball(this, this.attack_damage), this.facing, 0.15, this.position);
		this.scale = 1.1;
		this.scale_over_time(1, 10);
	}

	update_path(): void {
		super.update_path();
		this.path = this.manager.room.tiles.find_path(this.position, this.manager.room.manager.game.player.position.add(new Vec2(this.manager.random.next_int_ranged(-1, 1), this.manager.random.next_int_ranged(-1, 1))));
	}
}