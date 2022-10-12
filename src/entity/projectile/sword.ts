import Renderer from "../../game/renderer";
import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import Entity from "../entity";
import LivingEntity from "../living_entity";
import Projectile from "../projectile";

export default class Sword extends Projectile {
	starting_rotation: number;
	ending_rotation: number;
	rotation_speed: number;
	anchor_entity: Entity;

	constructor(owner: LivingEntity, damage = 5, angle = 20) {
		super(owner, damage);

		this.starting_rotation = owner.facing - angle;
		this.ending_rotation = owner.facing + angle;
		this.rotation_speed = 0.5;

		this.rotation = this.starting_rotation;
		this.size = new Vec2(2.5, 0.2);
		this.color = Color.RGB(220, 220, 220);
		this.corner_radius = 0.9;

		this.anchor_entity = this.owner;

		this.health.reset(8);

		this.follow();
	}

	on_enemy_collision(entity: LivingEntity): void {
		if (this.owner.trace_tiles(this.rotation) < this.owner.distance_to(entity))
			return;

		super.on_enemy_collision(entity);

		entity.move(Vec2.step(entity.position.subtract(this.owner.position)));
	}

	tick(): void {
		super.tick();

		if (this.rotation > this.ending_rotation)
			this.health.damage(1, 0);
		else {
			this.rotation += this.rotation_speed;
			this.rotation_speed += 0.5;
		}

		this.follow();
	}

	render(): void {
		Renderer.sword(this.position, this.size, this.color, this.corner_radius, { scale: this.scale, rotation: this.rotation });
	}

	set_position(position: Vec2): void {
		this.position.copy(position.add(this.anchor_entity.position));
	}

	follow(): void {
		this.set_position(Vec2.from_angle(this.rotation).multiply(2));
	}

	on_tile_collision(): void {

	}
}