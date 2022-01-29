import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import Entity from "../entity";
import LivingEntity from "../living_entity";
import Projectile from "../projectile";

export default class Sword extends Projectile {
	starting_rotation: number;
	ending_rotation: number;
	rotation_speed: number;

	constructor(parent: LivingEntity, damage = 5, angle = 20) {
		super(parent, damage);

		this.starting_rotation = parent.facing - angle;
		this.ending_rotation = parent.facing + angle;
		this.rotation_speed = 2;

		this.rotation = this.starting_rotation;
		this.anchored = true;

		this.size = new Vec2(2.5, 0.2);
		this.color = Color.RGB(255, 128, 0);
		this.corner_radius = 0.9;

		this.max_health = 4;
		this.health = 4;

		this.follow();
	}

	on_enemy_collision(entity: LivingEntity): void {
		if (this.parent.trace_tiles(this.rotation) < this.parent.distance_to(entity))
			return;

		super.on_enemy_collision(entity);

		entity.move(Vec2.step(entity.position.subtract(this.parent.position)));
	}

	tick(): void {
		super.tick();

		if (this.rotation > this.ending_rotation)
			this.health--;
		else {
			this.rotation += this.rotation_speed;
			this.rotation_speed += 1;
		}

		if (this.health <= 0)
			this.destroy();
	}

	follow(): void {
		this.set_position(Vec2.from_angle(this.rotation).multiply(2));
	}
}