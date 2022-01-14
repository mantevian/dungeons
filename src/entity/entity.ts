import Color from "../util/color";
import Vec2 from "../util/vec2";

export default class Entity {
	readonly position: Vec2;
	size: Vec2;
	color: Color;
	corner_radius: number;

	constructor() {
		this.position = Vec2.zero();
		this.size = new Vec2(1, 1);
		this.color = Color.RGB(255, 255, 255);
		this.corner_radius = 0;
	}

	/** Force position this Entity */
	set_position(position: Vec2): void {
		this.position.copy(position);
	}

	move(vec: Vec2): void {
		this.position.add(vec);
	}

	/** Tick this Entity */
	tick(): void {

	}
}