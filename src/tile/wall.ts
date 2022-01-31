import TileManager from "../room/tile_manager";
import Vec2 from "../util/vec2";
import Tile from "./tile";

export default class Wall extends Tile {
	constructor(position: Vec2, manager: TileManager) {
		super(position, manager);
		this.color = this.manager.room.biome.wall_color;
		this.solid = true;
	}
}