import Renderer from "../game/renderer";
import TileManager from "../room/tile_manager";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import SAT from "sat";

export default class Tile {
	manager: TileManager;
	solid: boolean;

	readonly position: Vec2;
	color: Color;

	constructor(position: Vec2, manager: TileManager) {
		this.position = position;
		this.manager = manager;
		this.color = this.manager.room.biome.tile_color;
		this.solid = false;
	}

	tick(): void {
		this.render();
	}

	render(): void {
		Renderer.rect(this.position.add(new Vec2(0.5, 0.5)), Vec2.one(), this.color, 0.1);
	}

	sat_polygon(): SAT.Polygon {
		return new SAT.Polygon(this.position.sat_vector(), [new SAT.Vector(0, 0),
		new SAT.Vector(1, 0),
		new SAT.Vector(1, 1),
		new SAT.Vector(0, 1)]);
	}
}