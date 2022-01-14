import EntityManager from "../room/entity_manager";
import Color from "../util/color";
import Vec2 from "../util/vec2";

export default class Entity {
	manager: EntityManager;

	readonly position: Vec2;
	
	size: Vec2;
	color: Color;
	corner_radius: number;

	lifetime: number;

	constructor() {
		this.position = Vec2.zero();
		this.size = new Vec2(1, 1);
		this.color = Color.RGB(255, 255, 255);
		this.corner_radius = 0;

		this.lifetime = 0;
	}

	/** Force position this Entity */
	set_position(position: Vec2): void {
		this.position.copy(position);
	}

	move(vec: Vec2): void {
		let new_position = this.position.add(vec);

		if (this.manager.room.tiles.passable(new_position))
			this.set_position(new_position);
	}

	/** Tick this Entity */
	tick(): void {
		this.lifetime++;
	}
}