import Room from "../room/room";
import Vec2 from "../util/vec2";
import Game from "./game";

export default class RoomManager {
	readonly game: Game;
	private rooms: Map<string, Room>;
	current_room: Room;

	constructor(game: Game) {
		this.game = game;
		this.rooms = new Map<string, Room>();

		for (let i = -2; i <= 2; i++)
			for (let j = -2; j <= 2; j++) {
				this.set(new Room(new Vec2(i, j), this));
			}
		
		this.enter(Vec2.zero());
	}

	tick(): void {
		this.current_room.tick();
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
		let w = Game.width;
		let room = new Vec2(Math.floor(position.x / w), Math.floor(position.y / w));
		return this.get(room).tiles.passable(position.modulus_room(), size);
	}
}