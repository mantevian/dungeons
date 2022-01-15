import Color from "../util/color";
import Vec2 from "../util/vec2";
import BasicMob from "./basic_mob";
import Entity from "./entity";

export default class BasicProjectile extends Entity {
	player_friendly: boolean;

	constructor(player_friendly: boolean) {
		super();

		this.size = new Vec2(0.2, 0.2);
		this.color = Color.RGB(255, 128, 0);

		this.player_friendly = player_friendly;
	}

	tick(): void {
		super.tick();

		if (this.player_friendly) {
			for (let entity of this.manager.filter(entity => entity instanceof BasicMob))
				if (this.collides_with_entity(entity[1])) {
					entity[1].damage(5);
					this.destroy();
				}
		}
		else {

		}
	}

	on_moved_into_obstacle(): void {
		this.destroy();
	}
}