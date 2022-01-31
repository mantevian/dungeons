import Game from "../game/game";
import RoomManager from "../game/room_manager";
import Vec2 from "../util/vec2";
import { Biome } from "./biome";
import EntityManager from "./entity_manager";
import ParticleManager from "./particle_manager";
import TileManager from "./tile_manager";

export default class Room {
	manager: RoomManager;
	readonly position: Vec2;

	readonly tiles: TileManager;
	readonly entities: EntityManager;
	readonly particles: ParticleManager;

	readonly biome: Biome;

	readonly difficulty: number;
	visited: boolean;
	cleared: boolean;

	constructor(position: Vec2, manager: RoomManager, biome: Biome, difficulty: number) {
		this.position = position;
		this.manager = manager;
		this.biome = biome;
		this.difficulty = Math.floor(difficulty);
		this.tiles = new TileManager(this);
		this.entities = new EntityManager(this);
		this.particles = new ParticleManager(this);
	}

	tick(): void {
		this.tiles.tick();
		this.particles.tick();
		this.entities.tick();
		
		this.visited = true;

		if (this.entities.size() == 0)
			this.cleared = true;
		
		console.log(this.difficulty)
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