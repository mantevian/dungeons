import Color from "../util/color";
import Vec2 from "../util/vec2";
import Tile from "./tile";

export default class Wall extends Tile {
	constructor(position: Vec2) {
		super(position);

		this.color = Color.RGB(40, 80, 160);
		this.solid = true;
	}
}