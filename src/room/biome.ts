import Color from "../util/color"

export class Biome {
	id: string;
	difficulty: number;

	background_color: Color;
	tile_color: Color;
	wall_color: Color;
	map_color: Color;

	constructor(id: string, difficulty: number, background_color: Color, tile_color: Color, wall_color: Color, map_color: Color) {
		this.id = id;
		this.difficulty = difficulty;
		this.background_color = background_color;
		this.tile_color = tile_color;
		this.wall_color = wall_color;
		this.map_color = map_color;
	}
}

const Biomes = {
	DEFAULT: new Biome('default', 1, Color.RGB(37, 33, 53), Color.RGB(56, 49, 86), Color.RGB(92, 75, 170), Color.RGB(180, 100, 255)),
	FOREST: new Biome('forest', 1.2, Color.RGB(27, 53, 31), Color.RGB(32, 82, 42), Color.RGB(61, 170, 68), Color.RGB(120, 255, 120)),
	DESERT: new Biome('desert', 1.42, Color.RGB(53, 49, 27), Color.RGB(86, 80, 32), Color.RGB(170, 140, 64), Color.RGB(255, 220, 64)),
	SNOW: new Biome('snow', 1.65, Color.RGB(42, 45, 61), Color.RGB(60, 66, 95), Color.RGB(130, 140, 180), Color.RGB(150, 160, 255)),
	HELL: new Biome('hell', 2.0, Color.RGB(53, 33, 21), Color.RGB(86, 49, 24), Color.RGB(170, 92, 49), Color.RGB(255, 130, 49))
}

export default Biomes