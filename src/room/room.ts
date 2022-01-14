import EntityManager from "./entity_manager";
import TileManager from "./tile_manager";

export default class Room {
	tiles: TileManager;
	entities: EntityManager;

	constructor() {
		this.tiles = new TileManager();
		this.entities = new EntityManager();
	}
}