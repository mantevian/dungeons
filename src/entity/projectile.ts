import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";
import LivingEntity from "./living_entity";
import Player from "./player";

export default class Projectile extends Entity {
	attack_damage: number;
	velocity: Vec2;

	player_friendly: boolean;

	constructor(parent: Entity, damage = 5) {
		super();

		this.noclip = false;

		this.size = new Vec2(0.2, 0.2);
		this.color = Color.RGB(255, 128, 0);
		this.corner_radius = 0.3;

		this.parent = parent;

		this.attack_damage = damage;

		this.velocity = Vec2.zero();

		this.scale = 1.2;
		this.scale_per_tick = -0.01;
		this.scale_time = 1000;

		this.player_friendly = parent instanceof Player;
	}

	tick(): void {
		super.tick();

		this.move(this.velocity);
	}

	on_tile_collision(): void {
		this.destroy();
	}

	on_entity_collision(entity: Entity): void {
		if (!(entity instanceof LivingEntity))
			return;
		
		if (!this.player_friendly && !(entity instanceof Player))
			return;

		entity.damage(this.attack_damage, this.parent);
		this.destroy();
	}

	on_kill(target: Entity): void {
		this.parent.on_kill(target);
	}

	render(): void {
		super.render();

		if (this.scale > 0.5) {
			this.velocity = this.velocity.multiply(0.98);
			this.attack_damage *= 0.99;
		}
		else this.destroy();
	}
}