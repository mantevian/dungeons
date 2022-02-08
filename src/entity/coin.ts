import Renderer from "../game/renderer";
import GoldParticle from "../particle/gold";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";
import Player from "./player";

export default class Coin extends Entity {
	value: number;

	constructor(value: number) {
		super();

		this.value = value;
		this.size = new Vec2(0.4, 0.4);
		this.rotation = 0;
		this.color = Color.RGB(255, 255, 64);
		this.corner_radius = 1;
		this.noclip = false;
	}

	tick(): void {
		super.tick();

		this.size.x = Math.cos(this.lifetime / 10) * 0.35;
	}

	on_entity_collision(entity: Entity): void {
		super.on_entity_collision(entity);

		if (entity instanceof Player) {
			entity.gold += this.value;
			this.destroy();
		}
	}

	destroy(source?: Entity): void {
		for (let i = 0; i < 4; i++)
			this.manager.room.particles.spawn(new GoldParticle(this.position, 0.07, this.manager.room.particles));

		super.destroy(source);
	}

	render(): void {
		super.render();

		Renderer.text(this.position, 9, Color.RGB(32, 32, 32), this.value.toString(), true);
	}
}