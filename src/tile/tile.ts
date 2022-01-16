import Renderer from "../game/renderer";
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
		this.color = Color.RGB(56, 49, 86);

		this.solid = false;
	}

	tick(): void {
		this.render();
	}

	render(): void {
		Renderer.rect(this.position.add(new Vec2(0.5, 0.5)), Vec2.one(), this.color, 0.1);
	}
}