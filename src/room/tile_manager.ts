import Tile from "../tile/tile";
import Vec2 from "../util/vec2";

export default class TileManager {
	private tiles: Map<Vec2, Tile>;

	constructor() {
		this.tiles = new Map<Vec2, Tile>();

		for (let i = -10; i <= 10; i++)
			for (let j = -10; j <= 10; j++) {
				this.tiles.set(new Vec2(i, j), new Tile());
			}
	}

	/** Get a Tile at a position */
	get(position: Vec2): Tile {
		return this.tiles.get(position);
	}

	/** Set a new Tile */
	set(position: Vec2, tile: Tile): void {
		this.tiles.set(position, tile);
	}

	/** Remove a tile by its position */
	remove(position: Vec2): void {
		this.tiles.delete(position);
	}

	/** Return the map */
	map(): Map<Vec2, Tile> {
		return this.tiles;
	}
}