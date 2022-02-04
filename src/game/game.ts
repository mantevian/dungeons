import p5 from "p5";
import Player from "../entity/player";
import { PlayerClass } from "../entity/player_class";
import Random from "../util/random";
import Vec2 from "../util/vec2";
import Renderer from "./renderer";
import RoomManager from "./room_manager";

export enum GameStates {
	MENU = 'menu',
	RUNNING = 'running',
	DEAD = 'dead'
}

export default class Game {
	readonly room_manager: RoomManager;
	private time: number;
	readonly player: Player;
	readonly random: Random;

	static readonly width = 15;
	static readonly center = this.width / 2;

	state: GameStates
	player_class: string;

	keys_down: Map<string, number>;

	mouse_pos: Vec2;

	constructor(p5: p5, player_class: string) {
		this.random = new Random();
		this.room_manager = new RoomManager(this);
		this.time = 0;
		this.player_class = player_class;
		this.player = new Player(this, player_class);
		this.player.set_position(new Vec2(Game.center, Game.center));
		this.mouse_pos = Vec2.zero();

		Renderer.game = this;
		Renderer.p5 = p5;
		Renderer.scale = 600 / Game.width;

		this.state = GameStates.MENU;
		this.keys_down = new Map<string, number>();

		window.addEventListener('keydown', (e: KeyboardEvent) => this.keydown(e));
		window.addEventListener('keyup', (e: KeyboardEvent) => this.keyup(e));
		window.addEventListener('mousedown', (e: MouseEvent) => this.mousedown(e));
		window.addEventListener('mouseup', (e: MouseEvent) => this.mouseup(e));
		document.getElementById('defaultCanvas0').addEventListener('mousemove', (e: MouseEvent) => this.mousemove(e));

		this.start();
	}

	start(): void {
		this.state = GameStates.RUNNING
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

	mouseup(e: MouseEvent): void {
		this.player.mouseup(e);
	}

	mousemove(e: MouseEvent): void {
		let canvas = document.getElementById('defaultCanvas0');
		this.mouse_pos = new Vec2(e.x - canvas.offsetLeft, e.y - canvas.offsetTop);
	}

	tick(): void {
		if (this.player.position.x < 0)
			this.room_manager.enter(this.room_manager.current_room.position.add(new Vec2(-1, 0)));

		if (this.player.position.x > Game.width)
			this.room_manager.enter(this.room_manager.current_room.position.add(new Vec2(1, 0)));

		if (this.player.position.y < 0)
			this.room_manager.enter(this.room_manager.current_room.position.add(new Vec2(0, -1)));

		if (this.player.position.y > Game.width)
			this.room_manager.enter(this.room_manager.current_room.position.add(new Vec2(0, 1)));

		this.player.position = this.player.position.modulus_room();
		this.player.manager = this.room_manager.current_room.entities;
		this.room_manager.tick();
		this.player.look(this.mouse_pos);
		this.player.tick();
		this.time++;

		for (let key of this.keys_down)
			if (key[1] > 0)
				this.keys_down.set(key[0], key[1] - 1);
			else if (key[1] != -1)
				this.keys_down.delete(key[0]);
	}

	stop_caused_by_death(): void {
		window.removeEventListener('keydown', (e: KeyboardEvent) => this.keydown(e));
		window.removeEventListener('keyup', (e: KeyboardEvent) => this.keyup(e));
		window.removeEventListener('mousedown', (e: MouseEvent) => this.mousedown(e));
		window.removeEventListener('mouseup', (e: MouseEvent) => this.mouseup(e));
		document.getElementById('defaultCanvas0').removeEventListener('mousemove', (e: MouseEvent) => this.mousemove(e));

		this.state = GameStates.DEAD;
	}

	get_time(): number {
		return this.time;
	}
}