import Game from "../game/game";
import Renderer from "../game/renderer";
import Color from "../util/color";
import Vec2 from "../util/vec2";
import entity from "./entity";
import LivingEntity from "./living_entity";

export default class Player extends LivingEntity {
	attack_cooldown: number;
	max_attack_cooldown: number;

	xp: number;

	constructor(game: Game) {
		super();

		this.manager = game.room_manager.current_room.entities;
		this.size = new Vec2(0.8, 0.8);
		this.color = Color.RGB(40, 255, 40);
		this.corner_radius = 0.35;

		this.attack_cooldown = 20;
		this.max_attack_cooldown = 20;

		this.attack_damage = 5;

		this.xp = 0;
	}

	keyup(e: KeyboardEvent): void {

	}

	mousedown(e: MouseEvent): void {
		this.attack();
	}

	tick(): void {
		super.tick();

		if (this.attack_cooldown > 0)
			this.attack_cooldown--;
		
		if (this.health < 0)
			this.manager.room.manager.game.stop();
	}

	can_go_through(position: Vec2): boolean {
		return this.manager.room.manager.passable(position, this.size);
	}

	render(): void {
		super.render();

		Renderer.pointer(this);

		if (this.damage_invincibility_timer > 0)
			Renderer.rect(new Vec2(0, 0), new Vec2(100, 100), Color.RGBA(255, 100, 0, 32 * this.damage_invincibility_timer / this.max_damage_invincibility_timer), 0);
	}

	attack(): void {
		if (this.attack_cooldown > 0)
			return;
		
		super.attack();

		this.attack_cooldown = this.max_attack_cooldown;
	}

	on_kill(target: entity): void {
		this.xp++;
	}

	keydown(keys: Map<string, number>): void {
		let move = new Vec2(0, 0);

		for (let code of keys.keys())
			switch (code) {
				case 'KeyW':
					move = move.add(new Vec2(0, -1));
					break;

				case 'KeyA':
					move = move.add(new Vec2(-1, 0));
					break;

				case 'KeyS':
					move = move.add(new Vec2(0, 1));
					break;

				case 'KeyD':
					move = move.add(new Vec2(1, 0));
					break;
			}

		this.move(move);
	}
}