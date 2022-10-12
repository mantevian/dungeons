import FlameParticle from "../../particle/flame";
import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import BurnEffect from "../effect/burn";
import Entity from "../entity";
import LivingEntity from "../living_entity";
import Projectile from "../projectile";

export default class Fireball extends Projectile {
	burn_duration: number;
	burn_level: number;
	burn_speed: number;

	constructor(owner: Entity, damage = 5, burn_duration = 180, burn_speed = 30) {
		super(owner, damage);

		this.size = new Vec2(0.35, 0.35);
		this.color = Color.RGB(255, 192, 0);
		this.corner_radius = 0.5;
		this.burn_duration = burn_duration;
		this.burn_level = 1;
		this.burn_speed = burn_speed;
	}

	tick(): void {
		super.tick();

		if (this.lifetime % 3 == 0)
			this.manager.room.particles.spawn(new FlameParticle(this.position, 0.03, this.manager.room.particles));

		this.move(this.velocity);
	}

	on_enemy_collision(entity: LivingEntity): void {
		super.on_enemy_collision(entity);

		entity.move(Vec2.step(entity.position.subtract(this.position)));
		entity.apply_status_effect(new BurnEffect(this.burn_duration, this.burn_level, this.burn_speed));

		this.destroy();
	}

	destroy(): void {
		super.destroy();

		for (let i = 0; i < this.manager.random.next_int_ranged(4, 6); i++)
			this.manager.room.particles.spawn(new FlameParticle(this.position, 0.1, this.manager.room.particles));
	}
}