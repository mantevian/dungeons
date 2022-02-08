import Game from "../game/game";
import Random from "../util/random";
import Vec2 from "../util/vec2";
import Room from "./room";
import PF from 'pathfinding';
import SAT from "sat";
import WorldTile from "../tile/world_tile";
import { TileTypes } from "../tile/tile";

export default class TileManager {
	readonly room: Room;
	private tiles: Map<string, WorldTile>;
	readonly random: Random;
	readonly pathfinding_grid: PF.Grid;
	readonly pathfinder: PF.AStarFinder;

	constructor(room: Room, data: Map<string, string>) {
		this.room = room;
		this.tiles = new Map<string, WorldTile>();
		this.random = new Random();

		let w = Game.width;

		this.pathfinding_grid = new PF.Grid(w, w);

		for (let i = 0; i < w; i++)
			for (let j = 0; j < w; j++) {
				this.clear(new Vec2(i, j));
			}

		for (let entry of data) {
			let pos = Vec2.parse(entry[0]);
			switch (entry[1]) {
				case 'tile':
					this.set(new WorldTile(TileTypes.tile(this.room.biome), pos));
					break;

				case 'wall':
					this.set(new WorldTile(TileTypes.wall(this.room.biome), pos));
					break;
			}
		}

		this.pathfinder = new PF.AStarFinder();
	}

	tick(): void {
		for (let tile of this.tiles.values())
			tile.tick();
	}

	get(position: Vec2): WorldTile {
		return this.tiles.get(position.floor().toString());
	}

	set(tile: WorldTile): void {
		tile.manager = this;
		this.tiles.set(tile.position.toString(), tile);
		this.pathfinding_grid.setWalkableAt(tile.position.x, tile.position.y, !tile.tile_type.solid);
	}

	clear(position: Vec2): void {
		this.set(new WorldTile(TileTypes.tile(this.room.biome), position));
	}

	get_tiles(): Map<string, WorldTile> {
		return this.tiles;
	}

	solid(position: Vec2): boolean {
		return this.get(position) && this.get(position).tile_type.solid;
	}

	passable(polygon: SAT.Polygon): boolean {
		for (let x = -1; x <= 1; x++)
			for (let y = -1; y <= 1; y++) {
				let pos = new Vec2(polygon.pos.x + x, polygon.pos.y + y);
				let tile = this.get(pos);
				if (this.solid(pos) && SAT.testPolygonPolygon(polygon, tile.sat_polygon())) return false;
			}

		return true;
	}

	array(): Array<WorldTile> {
		return [...this.tiles.values()];
	}

	to_solid_matrix(): Array<Array<number>> {
		let matrix = new Array<Array<number>>();

		for (let i = 0; i < Game.width; i++)
			for (let j = 0; j < Game.width; j++)
				matrix[i][j] = this.solid(new Vec2(i, j)) ? 1 : 0;

		return matrix;
	}

	find_path(start: Vec2, end: Vec2): Array<Vec2> {
		return this.pathfinder.findPath(start.constrain_room().floor().x, start.constrain_room().floor().y, end.constrain_room().floor().x, end.constrain_room().floor().y, this.pathfinding_grid.clone()).map(pos => new Vec2(pos[0] + 0.5, pos[1] + 0.5));
	}

	create_door(direction: 'left' | 'right' | 'up' | 'down'): void {
		switch (direction) {
			case 'left':
				this.clear(new Vec2(0, Math.floor(Game.center)));
				break;

			case 'right':
				this.clear(new Vec2(Game.width - 1, Math.floor(Game.center)));
				break;

			case 'up':
				this.clear(new Vec2(Math.floor(Game.center), 0));
				break;

			case 'down':
				this.clear(new Vec2(Math.floor(Game.center), Game.width - 1));
				break;
		}
	}
}