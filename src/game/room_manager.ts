import Biomes from "../room/biome";
import Room from "../room/room";
import { Direction, opposite, random, weighted } from "../util/direction";
import Random from "../util/random";
import Vec2 from "../util/vec2";
import Game from "./game";
import Renderer from "./renderer";

const fs = require('fs');

export default class RoomManager {
	readonly game: Game;
	private rooms: Map<string, Room>;
	current_room: Room;
	readonly random: Random;
	readonly layouts: Array<Object>;

	constructor(game: Game) {
		this.game = game;
		this.rooms = new Map<string, Room>();
		this.random = new Random();

		this.layouts = JSON.parse(fs.readFileSync('./assets/rooms.json', 'utf8'));

		this.set(new Room(Vec2.zero(), this, Biomes.DEFAULT, 0, this.layouts[0]));

		for (let thread = 0; thread < 10; thread++)
			this.thread(8);

		this.thread(6, Biomes.DEFAULT, Vec2.zero(), [{ item: 'right', weight: 15 }, { item: 'up', weight: 5 }, { item: 'down', weight: 1 }],
			(i, pos) => {
				if (i < 5) return;

				this.thread(5, Biomes.FOREST, pos, [{ item: 'right', weight: 1 }],
					(di, dpos) => {
						if (di == 2 || di == 4)
							this.thread(this.random.next_int_ranged(5, 6), Biomes.FOREST, dpos, [{ item: 'up', weight: 2 }, { item: 'down', weight: 1 }],
								(ddi, ddpos) => {
									if (ddi == 1 || ddi == 3 || ddi == 5)
										this.thread(this.random.next_int_ranged(2, 4), Biomes.FOREST, ddpos);
								});
					}
				);
			}
		);

		this.thread(6, Biomes.DEFAULT, Vec2.zero(), [{ item: 'left', weight: 15 }, { item: 'up', weight: 1 }, { item: 'down', weight: 5 }],
			(i, pos) => {
				if (i < 5) return;

				for (let t = 0; t < 4; t++)
					this.thread(3, Biomes.DESERT, pos, [{ item: 'left', weight: 2 }, { item: 'up', weight: 1 }, { item: 'down', weight: 1 }],
						(di, dpos) => {
							this.thread(this.random.next_int_ranged(3, 4), Biomes.DESERT, dpos);

							if (t == 3 && di == 2)
								this.thread(this.random.next_int_ranged(6, 12), Biomes.DESERT, dpos, [{ item: 'down', weight: 1 }]);
						}
					);
			}
		);

		this.thread(4, Biomes.DEFAULT, Vec2.zero(), [{ item: 'up', weight: 15 }, { item: 'left', weight: 1 }, { item: 'right', weight: 2 }],
			(i, pos) => {
				if (i < 3) return;

				this.thread(10, Biomes.SNOW, pos, [{ item: 'up', weight: 1 }],
					(di, dpos) => {
						this.thread(this.random.next_int_ranged(3, 4), Biomes.SNOW, dpos);

						if (di == 2 || di == 4 || di == 5 || di == 7)
							this.thread(this.random.next_int_ranged(3, 8), Biomes.SNOW, dpos, [{ item: 'left', weight: 1 }, { item: 'right', weight: 1 }, { item: 'down', weight: 1 }]);
					}
				);
			}
		);

		this.thread(4, Biomes.DEFAULT, Vec2.zero(), [{ item: 'down', weight: 15 }, { item: 'left', weight: 2 }, { item: 'right', weight: 1 }],
			(i, pos) => {
				if (i < 3) return;

				this.thread(3, Biomes.HELL, pos, [{ item: 'down', weight: 1 }],
					(di, dpos) => {
						if (di == 2)
							for (let t = 0; t < 8; t++)
								this.thread(this.random.next_int_ranged(4, 10), Biomes.HELL, dpos, [{ item: 'left', weight: 2 }, { item: 'right', weight: 2 }, { item: 'down', weight: 1 }]);
					}
				);
			}
		);

		for (let room of this.array()) {
			let pos = room.position;

			if (this.random.next_float() < 0.2)
				this.add_door(pos, random(this.random));
		}

		this.enter(Vec2.zero());
	}

	thread(iterations: number, biome = Biomes.DEFAULT, start = Vec2.zero(), directions?: Array<{ item: Direction, weight: number }>, on_iteration?: (i: number, pos: Vec2) => void): void {
		let direction = directions ? weighted(directions, this.random) : random(this.random);
		let pos = start;

		for (let i = 0; i < iterations; i++) {
			pos = pos.add(Vec2.from_direction(direction));

			if (Math.abs(pos.x) > 10 || Math.abs(pos.y) > 10)
				return;

			if (!this.get(pos)) {
				this.set(new Room(pos, this, biome, Math.sqrt(Math.abs(pos.x * pos.y)) + i / 4, this.random.choice(this.layouts)));
				this.add_door(pos, opposite(direction));
			}

			if (on_iteration)
				on_iteration(i, pos);

			direction = directions ? weighted(directions, this.random) : random(this.random);
		}
	}

	add_door(pos: Vec2, direction: 'left' | 'right' | 'up' | 'down'): void {
		let vec = Vec2.from_direction(direction);

		if (!this.get(pos.add(vec))) return;

		this.get(pos).tiles.create_door(direction);
		this.get(pos.add(vec)).tiles.create_door(opposite(direction));
	}

	array(): Array<Room> {
		return [...this.rooms.values()];
	}

	tick(): void {
		this.current_room.tick();
		Renderer.map();
	}

	get(position: Vec2): Room {
		return this.rooms.get(position.toString());
	}

	set(room: Room): void {
		this.rooms.set(room.position.toString(), room);
	}

	enter(position: Vec2): void {
		this.current_room = this.get(position);
	}
}