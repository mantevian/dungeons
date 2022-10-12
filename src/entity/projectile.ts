import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";
import LivingEntity from "./living_entity";
import Mob from "./mob";
import Player from "./player";

export default class Projectile extends Entity {
	attack_damage: number;
	velocity: Vec2;

	player_friendly: boolean;
	owner: Entity;

	constructor(owner: Entity, damage = 5) {
		super();

		this.noclip = false;

		this.size = new Vec2(0.2, 0.2);
		this.color = Color.RGB(255, 128, 0);
		this.corner_radius = 0.3;

		this.owner = owner;

		this.attack_damage = damage;

		this.velocity = Vec2.zero();

		this.scale = 1;
		this.scale_per_tick = 0;
		this.scale_time = 0;

		this.player_friendly = owner instanceof Player;
	}

	tick(): void {
		super.tick();
	}

	on_tile_collision(): void {
		this.destroy();
	}

	on_entity_collision(entity: Entity): void {
		if (entity.equals(this.owner))
			return;

		if (this.player_friendly && entity instanceof Mob)
			this.on_enemy_collision(entity);
		else
			if (entity instanceof Player)
				this.on_enemy_collision(entity);
	}

	on_enemy_collision(entity: LivingEntity): void {
		entity.damage(this.attack_damage, this.owner);
	}

	on_kill(target: Entity): void {
		this.owner.on_kill(target);
	}
}