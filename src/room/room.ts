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
}