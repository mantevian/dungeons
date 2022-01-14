import Tile from "../tile/tile";
import Wall from "../tile/wall";
import Vec2 from "../util/vec2";
import Room from "./room";

export default class TileManager {
	readonly room: Room;
	private tiles: Map<string, Tile>;

	constructor(room: Room) {
		this.room = room;
		this.tiles = new Map<string, Tile>();

		for (let i = 0; i < 21; i++)
			for (let j = 0; j < 21; j++) {
				this.clear(new Vec2(i, j));
			}

		for (let i = 0; i < 21; i++) {
			this.set(new Wall(new Vec2(i, 0)));
			this.set(new Wall(new Vec2(0, i)));
			this.set(new Wall(new Vec2(i, 20)));
			this.set(new Wall(new Vec2(20, i)));
		}

		for (let i = 0; i < 20; i++)
			this.set(new Wall(new Vec2(this.room.manager.game.random.next_int_ranged(2, 18), this.room.manager.game.random.next_int_ranged(2, 18))));

		if (this.room.position.x > -2)
			this.clear(new Vec2(0, 10));

		if (this.room.position.y > -2)
			this.clear(new Vec2(10, 0));

		if (this.room.position.x < 2)
			this.clear(new Vec2(20, 10));

		if (this.room.position.y < 2)
			this.clear(new Vec2(10, 20));
	}

	passable(position: Vec2): boolean {
		return !this.get(position) || !this.get(position).solid;
	}

	/** Get a Tile at a position */
	get(position: Vec2): Tile {
		return this.tiles.get(position.toString());
	}

	/** Set a new Tile */
	set(tile: Tile): void {
		tile.manager = this;
		this.tiles.set(tile.position.toString(), tile);
	}

	/** Remove a tile by its position */
	clear(position: Vec2): void {
		this.set(new Tile(position));
	}

	/** Return the map */
	map(): Map<string, Tile> {
		return this.tiles;
	}
}