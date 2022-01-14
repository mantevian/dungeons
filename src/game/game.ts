import p5 from "p5";
import Player from "../entity/player";
import Vec2 from "../util/vec2";
import Renderer from "./renderer";
import RoomManager from "./room_manager";

export default class Game {
	readonly room_manager: RoomManager;
	readonly renderer: Renderer;
	private time: number;
	readonly player: Player;

	constructor(p5: p5) {
		this.room_manager = new RoomManager();
		this.renderer = new Renderer(this, p5);
		this.time = 0;
		this.player = new Player();

		window.addEventListener('keydown', (e: KeyboardEvent) => this.controls(e));
	}

	controls(e: KeyboardEvent): void {
		switch (e.code) {
			case 'KeyW':
				this.player.move(new Vec2(0, -1));
				break;
			
			case 'KeyA':
				this.player.move(new Vec2(-1, 0));
				break;
			
			case 'KeyS':
				this.player.move(new Vec2(0, 1));
				break;
			
			case 'KeyD':
				this.player.move(new Vec2(1, 0));
				break;
		}
	}

	/** The main tick function for this Game */
	tick(): void {
		this.room_manager.current_room.entities.tick();
		this.time++;

		this.renderer.render();
	}

	/** The amount of ticks since this Game's start */
	get_time(): number {
		return this.time;
	}
}