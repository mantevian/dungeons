import Game from "../game/game";
import Tile from "../tile/tile";
import Wall from "../tile/wall";
import Random from "../util/random";
import Vec2 from "../util/vec2";
import Room from "./room";

export default class TileManager {
	readonly room: Room;
	private tiles: Map<string, Tile>;
	readonly random: Random;

	constructor(room: Room) {
		this.room = room;
		this.tiles = new Map<string, Tile>();
		this.random = new Random();

		let w = Game.width;
		let c = Math.floor(w / 2);

		for (let i = 0; i < w; i++)
			for (let j = 0; j < w; j++) {
				this.clear(new Vec2(i, j));
			}

		for (let i = 0; i < w; i++) {
			this.set(new Wall(new Vec2(i, 0)));
			this.set(new Wall(new Vec2(0, i)));
			this.set(new Wall(new Vec2(i, w - 1)));
			this.set(new Wall(new Vec2(w - 1, i)));
		}

		for (let i = 0; i < this.random.next_int_ranged(8 + 3 * Math.abs(this.room.position.x) * Math.abs(this.room.position.y), 12 + 8 * Math.abs(this.room.position.x) * Math.abs(this.room.position.y)); i++)
			this.set(new Wall(new Vec2(this.room.manager.game.random.next_int_ranged(2, w - 3), this.room.manager.game.random.next_int_ranged(2, w - 3))));

		if (this.room.position.x > -2)
			this.clear(new Vec2(0, c));

		if (this.room.position.y > -2)
			this.clear(new Vec2(c, 0));

		if (this.room.position.x < 2)
			this.clear(new Vec2(w - 1, c));

		if (this.room.position.y < 2)
			this.clear(new Vec2(c, w - 1));
	}

	tick(): void {
		for (let tile of this.tiles.values())
			tile.tick();
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

	solid(position: Vec2): boolean {
		return this.get(position) && this.get(position).solid;
	}

	passable(position: Vec2, size: Vec2): boolean {
		let left_up = new Vec2(Math.floor(position.x - size.x * 0.5), Math.floor(position.y - size.y * 0.5));
		let right_up = new Vec2(Math.floor(position.x + size.x * 0.5), Math.floor(position.y - size.y * 0.5));
		let right_down = new Vec2(Math.floor(position.x + size.x * 0.5), Math.floor(position.y + size.y * 0.5));
		let left_down = new Vec2(Math.floor(position.x - size.x * 0.5), Math.floor(position.y + size.y * 0.5));

		return !this.solid(left_up) && !this.solid(right_up) && !this.solid(right_down) && !this.solid(left_down);
	}
}