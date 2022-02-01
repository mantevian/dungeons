import Color from "../util/color"
import Random from "../util/random";

export class Biome {
	id: string;
	difficulty: number;

	background_color: Color;
	tile_color: Color;
	wall_color: Color;
	map_color: Color;

	mob_picker: Array<{ item: string, weight: number }>;

	random: Random;

	constructor(id: string, difficulty: number, background_color: Color, tile_color: Color, wall_color: Color, map_color: Color, mob_picker: Array<{ item: string, weight: number }>) {
		this.id = id;
		this.difficulty = difficulty;
		this.background_color = background_color;
		this.tile_color = tile_color;
		this.wall_color = wall_color;
		this.map_color = map_color;

		this.mob_picker = mob_picker;

		this.random = new Random();
	}

	next_mob() {
		return this.random.weighted_random(this.mob_picker);
	}
}

const Biomes = {
	DEFAULT: new Biome('default', 1, Color.RGB(37, 33, 53), Color.RGB(56, 49, 86), Color.RGB(92, 75, 170), Color.RGB(180, 100, 255), [{ item: 'turret', weight: 5 }, { item: 'swordsman', weight: 1 }]),
	FOREST: new Biome('forest', 1.2, Color.RGB(53, 43, 38), Color.RGB(82, 65, 58), Color.RGB(61, 170, 68), Color.RGB(120, 255, 120), [{ item: 'turret', weight: 2 }, { item: 'archer', weight: 4 }]),
	DESERT: new Biome('desert', 1.42, Color.RGB(53, 49, 27), Color.RGB(86, 80, 32), Color.RGB(170, 140, 64), Color.RGB(255, 220, 64), [{ item: 'archer', weight: 1 }, { item: 'mage', weight: 2 }]),
	SNOW: new Biome('snow', 1.65, Color.RGB(34, 36, 56), Color.RGB(56, 60, 95), Color.RGB(130, 140, 180), Color.RGB(155, 165, 255), [{ item: 'turret', weight: 5 }, { item: 'swordsman', weight: 5 }]),
	HELL: new Biome('hell', 2.0, Color.RGB(53, 33, 21), Color.RGB(86, 49, 24), Color.RGB(170, 92, 49), Color.RGB(255, 130, 49), [{ item: 'swordsman', weight: 1 }, { item: 'mage', weight: 1 }])
}

export default Biomes