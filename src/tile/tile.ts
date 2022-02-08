import Color from "../util/color";
import Biomes, { Biome } from "../room/biome";

export default class Tile {
	solid: boolean;
	color: Color;

	constructor(solid: boolean, color: Color) {
		this.color = color;
		this.solid = solid;
	}
}

export class TileTypes {
	static tile(biome: Biome) {
		return new Tile(false, biome.tile_color);
	}

	static wall(biome: Biome) {
		return new Tile(true, biome.wall_color);
	}
}