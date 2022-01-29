import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import Particle from "./particle";

export default class DamageCountParticle extends Particle {
	damage: number;

	constructor(position: Vec2, damage: number) {
		super();

		this.lifetime = 30;
		this.position = position;
		this.damage = damage;
	}

	tick(): void {
		super.tick();
		this.position = this.position.add(new Vec2(0, -0.01));
	}

	render(): void {
		Renderer.text(this.position, 12, Color.RGBA(255, 128, 20, this.lifetime * 255 / 30), this.damage.toString());
	}
}