import Room from "../room/room";
import Vec2 from "../util/vec2";

export default class RoomManager {
	private rooms: Map<Vec2, Room>;
	current_room: Room;

	constructor() {
		this.rooms = new Map<Vec2, Room>();

		let room = new Room();
		this.set(Vec2.zero(), room);
		this.current_room = room;
	}

	/** Get a Room by position */
	get(position: Vec2): Room {
		return this.rooms.get(position);
	}

	/** Set a new Room */
	set(position: Vec2, room: Room): void {
		this.rooms.set(position, room);
	}

	enter(position: Vec2): void {
		this.current_room = this.get(position);
	}
}