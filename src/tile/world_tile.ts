import Renderer from "../game/renderer";
import TileManager from "../room/tile_manager";
import Vec2 from "../util/vec2";
import Tile from "./tile";
import SAT from "sat";

export default class WorldTile {
	tile_type: Tile;
	manager: TileManager;
	readonly position: Vec2;

	constructor(type: Tile, position: Vec2) {
		this.tile_type = type;
		this.position = position;
	}

	sat_polygon(): SAT.Polygon {
		return new SAT.Polygon(this.position.sat_vector(), [new SAT.Vector(0, 0),
		new SAT.Vector(1, 0),
		new SAT.Vector(1, 1),
		new SAT.Vector(0, 1)]);
	}
	
	tick(): void {
		this.render();
	}

	render(): void {
		Renderer.rect(this.position.add(new Vec2(0.5, 0.5)), Vec2.one(), this.tile_type.color, 0.1);
	}
}