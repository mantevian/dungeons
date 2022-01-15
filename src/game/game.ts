import p5 from "p5";
import Player from "../entity/player";
import Random from "../util/random";
import Vec2 from "../util/vec2";
import Renderer from "./renderer";
import RoomManager from "./room_manager";

export default class Game {
	readonly room_manager: RoomManager;
	private time: number;
	readonly player: Player;
	readonly random: Random;

	static readonly width = 15;
	static readonly center = Math.floor(this.width / 2);

	keys_down: Map<string, number>;

	mouse_pos: Vec2;

	constructor(p5: p5) {
		this.random = new Random();
		this.room_manager = new RoomManager(this);
		this.time = 0;
		this.player = new Player(this);
		this.player.set_position(new Vec2(Game.center, Game.center));
		this.mouse_pos = Vec2.zero();

		Renderer.game = this;
		Renderer.p5 = p5;
		Renderer.scale = 600 / Game.width;

		this.keys_down = new Map<string, number>();

		window.addEventListener('keydown', (e: KeyboardEvent) => this.keydown(e));
		window.addEventListener('keyup', (e: KeyboardEvent) => this.keyup(e));
		window.addEventListener('mousedown', (e: MouseEvent) => this.mousedown(e));
		document.getElementById('defaultCanvas0').addEventListener('mousemove', (e: MouseEvent) => this.mousemove(e));
	}

	keydown(e: KeyboardEvent): void {
		this.keys_down.set(e.code, -1);
		this.player.keydown(this.keys_down);
	}

	keyup(e: KeyboardEvent): void {
		this.keys_down.set(e.code, 2);
		this.player.keyup(e);
	}

	mousedown(e: MouseEvent): void {
		this.player.mousedown(e);
	}

	mousemove(e: MouseEvent): void {
		let canvas = document.getElementById('defaultCanvas0');
		this.mouse_pos = new Vec2(e.x - canvas.offsetLeft, e.y - canvas.offsetTop);
	}

	/** The main tick function for this Game */
	tick(): void {
		this.room_manager.enter(new Vec2(Math.floor(this.player.position.x / Game.width), Math.floor(this.player.position.y / Game.width)));

		this.room_manager.tick();
		this.player.tick();
		this.player.look(this.mouse_pos);
		this.time++;

		for (let key of this.keys_down)
			if (key[1] > 0)
				this.keys_down.set(key[0], key[1] - 1);
			else if (key[1] != -1)
				this.keys_down.delete(key[0]);
	}

	/** The amount of ticks since this Game's start */
	get_time(): number {
		return this.time;
	}
}