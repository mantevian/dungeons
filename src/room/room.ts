import Entity from "../entity/entity";
import RoomManager from "../game/room_manager";
import Vec2 from "../util/vec2";
import EntityManager from "./entity_manager";
import TileManager from "./tile_manager";

export default class Room {
	manager: RoomManager;
	readonly position: Vec2;

	readonly tiles: TileManager;
	readonly entities: EntityManager;

	constructor(position: Vec2, manager: RoomManager) {
		this.position = position;
		this.manager = manager;
		this.tiles = new TileManager(this);
		this.entities = new EntityManager(this);
	}

	tick(): void {
		this.tiles.tick();
		this.entities.tick();
	}

	passable(position: Vec2): boolean {
		let tile = new Vec2(Math.floor(position.x + 0.5), Math.floor(position.y + 0.5));
		return (!this.tiles.get(tile) || !this.tiles.get(tile).solid);
	}
}