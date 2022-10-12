import Renderer from "../../game/renderer";
import Color from "../../util/color";
import Vec2 from "../../util/vec2";
import Entity from "../entity";
import LivingEntity from "../living_entity";
import Projectile from "../projectile";

export default class Arrow extends Projectile {
	constructor(owner: Entity, damage = 9) {
		super(owner, damage);

		this.health.reset(20);

		this.size = new Vec2(0.5, 0.2);
		this.color = Color.RGB(64, 255, 192);
		this.corner_radius = 0.3;
	}

	tick(): void {
		super.tick();

		this.move(this.velocity);
	}

	on_enemy_collision(entity: LivingEntity): void {
		super.on_enemy_collision(entity);
		this.attack_damage *= 0.98;
	}

	on_tile_collision(): void {
		this.health.damage(1);
	}

	render(): void {
		Renderer.arrow(this.position, this.size, this.color, this.corner_radius, { scale: this.scale, rotation: this.rotation });
	}
}