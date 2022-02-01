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

	constructor(position: Vec2, manager: RoomManager, biome: Biome, difficulty: number, data: Object) {
		this.position = position;
		this.manager = manager;
		this.biome = biome;
		this.difficulty = Math.floor(difficulty);

		let tiles = new Map<string, string>();
		let entities = new Map<string, string>();

		let rotation = [this.manager.random.next_int_ranged(0, 1), this.manager.random.next_int_ranged(0, 1)];

		for (let i = 0; i < data['data'].length; i++) {
			let e = data['data'][i];
			if (rotation[0] == 1)
				e = data['data'][Game.width * Game.width - i - 1];

			let key = data['keys'][e];
			if (key['chance'] && this.manager.random.next_float() > key['chance'])
				continue;
			
			let vec = new Vec2(i % Game.width, Math.floor(i / Game.width));
			if (rotation[1] == 1)
				vec = new Vec2(Math.floor(i / Game.width), i % Game.width);

			switch (key['type']) {
				case 'tile':
					tiles.set(vec.toString(), key['id']);
					break;

				case 'entity':
					entities.set(vec.toString(), key['id']);
					break;
			}
		}

		this.tiles = new TileManager(this, tiles);
		this.entities = new EntityManager(this, entities);
		this.particles = new ParticleManager(this);
	}

	tick(): void {
		this.tiles.tick();
		this.particles.tick();
		this.entities.tick();

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