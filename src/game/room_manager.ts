import Room from "../room/room";
import Random from "../util/random";
import Vec2 from "../util/vec2";
import Game from "./game";
import Renderer from "./renderer";

export default class RoomManager {
	readonly game: Game;
	private rooms: Map<string, Room>;
	current_room: Room;
	readonly random: Random;

	constructor(game: Game) {
		this.game = game;
		this.rooms = new Map<string, Room>();
		this.random = new Random();

		this.set(new Room(Vec2.zero(), this));
		
		for (let thread = 0; thread < 7; thread++) {
			let direction = this.random_direction();
			let pos = Vec2.zero();
			let prev_pos = Vec2.zero();

			for (let i = 0; i < 20; i++) {
				prev_pos = pos.clone();

				switch (direction) {
					case 'left':
						pos = pos.add(new Vec2(-1, 0));
						break;

					case 'right':
						pos = pos.add(new Vec2(1, 0));
						break;

					case 'up':
						pos = pos.add(new Vec2(0, -1));
						break;

					case 'down':
						pos = pos.add(new Vec2(0, 1));
						break;
				}

				if (!this.get(pos)) {
					this.set(new Room(pos, this));
					this.get(pos).tiles.create_door(this.opposite_direction(direction));
					this.get(prev_pos).tiles.create_door(direction);
				}
				
				direction = this.random_direction();
			}
		}

		for (let room of this.array()) {
			let pos = room.position;

			if (this.random.next_float() < 0.1 && this.get(pos.add(new Vec2(-1, 0)))) {
				this.get(pos).tiles.create_door('left');
				this.get(pos.add(new Vec2(-1, 0))).tiles.create_door('right');
			}
				
			if (this.random.next_float() < 0.1 && this.get(pos.add(new Vec2(1, 0)))) {
				this.get(pos).tiles.create_door('right');
				this.get(pos.add(new Vec2(1, 0))).tiles.create_door('left');
			}

			if (this.random.next_float() < 0.1 && this.get(pos.add(new Vec2(0, -1)))) {
				this.get(pos).tiles.create_door('up');
				this.get(pos.add(new Vec2(0, -1))).tiles.create_door('down');
			}

			if (this.random.next_float() < 0.1 && this.get(pos.add(new Vec2(0, 1)))) {
				this.get(pos).tiles.create_door('down');
				this.get(pos.add(new Vec2(0, 1))).tiles.create_door('up');
			}
		}

		this.enter(Vec2.zero());
	}

	random_direction(): 'left' | 'right' | 'up' | 'down' {
		return this.random.choice(['left', 'right', 'up', 'down']);
	}
	
	opposite_direction(direction: 'left' | 'right' | 'up' | 'down'): 'left' | 'right' | 'up' | 'down' {
		switch (direction) {
			case 'left': return 'right';
			case 'right': return 'left';
			case 'up': return 'down';
			case 'down': return 'up';
		}
	}

	array(): Array<Room> {
		return [...this.rooms.values()];
	}

	tick(): void {
		this.current_room.tick();
		Renderer.map();
	}

	/** Get a Room by position */
	get(position: Vec2): Room {
		return this.rooms.get(position.toString());
	}

	/** Set a new Room */
	set(room: Room): void {
		this.rooms.set(room.position.toString(), room);
	}

	enter(position: Vec2): void {
		this.current_room = this.get(position);
	}

	passable(position: Vec2, size: Vec2): boolean {
		return this.current_room.tiles.passable(position, size);
	}
}