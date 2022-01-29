import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import Entity from "../entity";
import LivingEntity from "../living_entity";
import Projectile from "../projectile";

export default class Bullet extends Projectile {
	constructor(parent: Entity, damage = 5) {
		super(parent, damage);

		this.size = new Vec2(0.2, 0.2);
		this.color = Color.RGB(255, 128, 0);
		this.corner_radius = 0.3;

		this.scale = 1.2;
		this.scale_per_tick = -0.01;
		this.scale_time = 1000;
	}

	tick(): void {
		super.tick();

		this.move(this.velocity);

		if (this.scale > 0.5) {
			this.velocity = this.velocity.multiply(0.98);
			this.attack_damage *= 0.99;
		}
		else this.destroy();
	}

	on_enemy_collision(entity: LivingEntity): void {
		super.on_enemy_collision(entity);

		this.destroy();
	}
}