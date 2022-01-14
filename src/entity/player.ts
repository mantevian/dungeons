import Color from "../util/color";
import Vec2 from "../util/vec2";
import Entity from "./entity";

export default class Player extends Entity {
	constructor() {
		super();

		this.size = new Vec2(1, 1);
		this.color = Color.RGB(40, 255, 40);
		this.corner_radius = 0.4;
	}
}