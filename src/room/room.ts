import Game from "../game/game";
import RoomManager from "../game/room_manager";
import Vec2 from "../util/vec2";
import EntityManager from "./entity_manager";
import ParticleManager from "./particle_manager";
import TileManager from "./tile_manager";

export default class Room {
	manager: RoomManager;
	readonly position: Vec2;

	readonly tiles: TileManager;
	readonly entities: EntityManager;
	readonly particles: ParticleManager;

	visited: boolean;
	cleared: boolean;

	constructor(position: Vec2, manager: RoomManager) {
		this.position = position;
		this.manager = manager;
		this.tiles = new TileManager(this);
		this.entities = new EntityManager(this);
		this.particles = new ParticleManager(this);
	}

	tick(): void {
		this.tiles.tick();
		this.entities.tick();
		this.particles.tick();

		this.visited = true;

		if (this.entities.size() == 0)
			this.cleared = true;
	}

	has_door(direction: 'left' | 'right' | 'up' | 'down'): boolean {
		let pos: Vec2;
		switch (direction) {
			case 'left':
				pos = new Vec2(0, Game.center).floor();
				break;
			
			case 'right':
				pos = new Vec2(Game.width - 1, Game.center).floor();
				break;
			
			case 'up':
				pos = new Vec2(Game.center, 0).floor();
				break;
			
			case 'down':
				pos = new Vec2(Game.center, Game.width - 1).floor();
				break;
		}

		return !this.tiles.solid(pos);
	}
}