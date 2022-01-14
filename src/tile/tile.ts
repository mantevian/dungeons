import TileManager from "../room/tile_manager";
import Color from "../util/color";
import Vec2 from "../util/vec2";

export default class Tile {
	manager: TileManager;
	solid: boolean;
	
	readonly position: Vec2;
	color: Color;

	constructor(position: Vec2) {
		this.position = position;
		this.color = Color.RGB(20, 30, 100);

		this.solid = false;
	}
}