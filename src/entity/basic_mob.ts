import Color from "../util/color";
import Entity from "./entity";

export default class BasicMob extends Entity {
	constructor() {
		super();

		this.color = Color.RGB(255, 80, 30);
		this.corner_radius = 0.2;
	}

	tick(): void {
		super.tick();
		
		if (this.lifetime % 30 == 0) {
			let v = this.position.step_to(this.manager.room.manager.game.player.position.modulus_room());
			if (this.manager.random.next_float() < 0.2)
				v.x = 0;
			
			if (this.manager.random.next_float() < 0.2)
				v.y = 0;
			
			this.move(v);
		}
	}
}