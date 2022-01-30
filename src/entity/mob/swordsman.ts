import Renderer from "../../game/renderer";
import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import Mob from "../mob";
import Sword from "../projectile/sword";

export default class Swordsman extends Mob {
	constructor() {
		super();

		this.color = Color.RGB(210, 160, 120);
		this.size = new Vec2(0.85, 0.85);
		this.corner_radius = 0.1;

		this.max_health = 45;
		this.health = 45;

		this.start_prepare_attack = 10;
		this.attack_damage = 6;

		this.xp = 3;
		this.money = 3;
	}

	tick(): void {
		super.tick();

		this.look(Renderer.canvas_coords(this.manager.room.manager.game.player.position));

		if (this.lifetime % 120 == 0)
			this.walk();

		if (this.lifetime % 120 == 0)
			this.try_attack();
	}

	attack(): void {
		this.manager.spawn_projectile(new Sword(this, this.attack_damage), this.facing);
		this.scale = 1.1;
		this.scale_over_time(1, 10);

		this.move(Vec2.step(Vec2.from_angle(this.facing)));
	}

	update_path(): void {
		super.update_path();
		this.path = this.manager.room.tiles.find_path(this.position, this.manager.room.manager.game.player.position);
	}
}