import ParticleManager from "../room/particle_manager";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import RectangleParticle from "./rect";

export default class FlameParticle extends RectangleParticle {
	constructor(position: Vec2, speed: number, manager: ParticleManager) {
		super(position, new Vec2(0.15, 0.15), Color.RGBA(255, 255, 0, 255), 0.6, 1, 0);
		this.manager = manager;

		this.velocity = new Vec2(this.manager.random.next_float_ranged(-speed, speed), this.manager.random.next_float_ranged(-speed, speed));
		this.acceleration = new Vec2(0.9, 0.9);
	}

	tick(): void {
		super.tick();
		this.color.set_alpha(this.color.alpha - 4);
		this.color.set_green(this.color.green - 4);
		if (this.color.alpha < 0)
			this.destroy();
	}
}