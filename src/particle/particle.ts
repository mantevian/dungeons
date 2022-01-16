import ParticleManager from "../room/particle_manager";
import Vec2 from "../util/vec2";
import { v4 as uuid } from "uuid";

export default class Particle {
	readonly uuid: string;
	position: Vec2;
	lifetime: number;
	manager: ParticleManager;

	constructor() {
		this.uuid = uuid();
	}

	tick(): void {
		if (this.lifetime > 0)
			this.lifetime--;
		else
			this.destroy();
		
		this.render();
	}

	render(): void {

	}

	destroy(): void {
		this.manager.remove(this.uuid);
	}
}